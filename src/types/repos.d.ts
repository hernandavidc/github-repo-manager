export interface Repo {
    id: string;
    name: string;
    url: string;
    stargazerCount: number;
}

export interface RepoFav {
    repoId: string;
    repoName: string;
    repoUrl: string;
}