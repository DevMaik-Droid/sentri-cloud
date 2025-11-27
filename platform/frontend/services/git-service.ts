import api from "@/lib/api";


export const getReposotories = async () => {
    const response = await api.get("/v1/auth/github/repos");
    return response.data;
}