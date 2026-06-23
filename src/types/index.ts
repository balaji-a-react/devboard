export interface GitHubUser {
    login: string;
    name: string;
    bio: string;
    avatar_url: string; 
    followers: number;
    following: number;
    public_repos: number;
    html_url: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    html_url: string;
}

export interface Task {
    id: number;
    text: string;
    priority: 'low' | 'medium' | 'high';
    done: boolean;
}

export type TaskAction =
 | {type: "ADD"; payload: Task} 
 | {type: "TOGGLE"; payload: number}
 | {type: "DELETE"; payload: number};