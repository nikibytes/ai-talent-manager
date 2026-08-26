import { AgentReachLinkedInClient } from "../../discovery/agent-reach/client";

export interface LinkedInJobSearchRequest {
  keywords: string;
  location?: string;
  filters?: Record<string, unknown>;
}

export interface TalentAgentDependencies {
  linkedin: Pick<AgentReachLinkedInClient, "searchJobs" | "getJobDetails">;
}

export interface TalentAgent {
  searchLinkedInJobs(request: LinkedInJobSearchRequest): Promise<unknown>;
  getLinkedInJobDetails(jobId: string | number): Promise<unknown>;
  discoverLinkedInJobs(request: LinkedInJobSearchRequest): Promise<unknown[]>;
}

/**
 * Main central Talent Agent boundary.
 *
 * This first slice intentionally focuses on LinkedIn discovery. Resume tailoring,
 * queue decisions, approvals, browser execution and persistence remain separate
 * collaborators so the agent can grow without coupling MCP details to business logic.
 */
export function createTalentAgent(
  dependencies: TalentAgentDependencies = { linkedin: new AgentReachLinkedInClient() },
): TalentAgent {
  return {
    async searchLinkedInJobs(request) {
      return dependencies.linkedin.searchJobs({
        keywords: request.keywords,
        ...(request.location ? { location: request.location } : {}),
        ...(request.filters ?? {}),
      });
    },

    async getLinkedInJobDetails(jobId) {
      return dependencies.linkedin.getJobDetails(jobId);
    },

    async discoverLinkedInJobs(request) {
      const searchResult = await this.searchLinkedInJobs(request);
      const ids = extractJobIds(searchResult);
      const details: unknown[] = [];

      for (const id of ids) {
        details.push(await this.getLinkedInJobDetails(id));
      }

      return details;
    },
  };
}

function extractJobIds(result: unknown): Array<string | number> {
  if (!Array.isArray(result)) return [];

  return result
    .map((job) => {
      if (typeof job !== "object" || job === null) return undefined;
      const record = job as Record<string, unknown>;
      return record.jobId ?? record.id;
    })
    .filter((id): id is string | number => typeof id === "string" || typeof id === "number");
}
