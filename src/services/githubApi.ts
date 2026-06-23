import type { GitHubRepo, GitHubUser } from "../types";

const BASE_URL = 'https://api.github.com';

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${BASE_URL}/users/${username}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${BASE_URL}/users/${username}/repos?sort=updated&per_page=6`
  );
  if (!res.ok) throw new Error('Could not fetch repositories');
  return res.json();
}