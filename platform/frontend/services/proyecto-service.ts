
import api from "@/lib/api";
import { GitHubRepo } from "@/types/git-types";


export const uploadProject = async (data: FormData) => {
    const response = await api.post("/v1/projects/upload", data);
    return response.data;
}

export const deployProject = async (projectId: number) => {
    const response = await api.post(`/v1/projects/${projectId}/deploy`);
    return response.data;
}

export const deployGithubProject = async (repositorio: GitHubRepo) => {
    
    const response = await api.post("/v1/projects/github/upload", repositorio);
    return response.data;
}