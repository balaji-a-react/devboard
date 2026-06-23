import { useState, useCallback } from 'react';
import { fetchGitHubUser, fetchGitHubRepos } from '../services/githubApi';
import type { GitHubUser, GitHubRepo } from '../types';

interface SearchState {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

function useGitHubSearch() {
  const [state, setState] = useState<SearchState>({
    user: null,
    repos: [],
    loading: false,
    error: null,
  });

  const search = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setState({ user: null, repos: [], loading: true, error: null });

    try {
      const [user, repos] = await Promise.all([
        fetchGitHubUser(username),
        fetchGitHubRepos(username),
      ]);
      setState({ user, repos, loading: false, error: null });
    } catch (err) {
      setState({
        user: null,
        repos: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }, []);

  return { ...state, search };
}

export default useGitHubSearch;