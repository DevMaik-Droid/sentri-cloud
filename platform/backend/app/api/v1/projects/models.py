

from pydantic import BaseModel, Field


class GithubDeployResponse(BaseModel):
    name: str
    url: str

class GitHubRepo(BaseModel):
    id: int
    name: str
    owner: str
    full_name: str = Field(alias="fullName")
    description: str | None = None
    language: str | None = None
    stars: int
    branch: str
    updated_at: str = Field(alias="updatedAt")


