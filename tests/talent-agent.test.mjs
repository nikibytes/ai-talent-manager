import test from "node:test";
import assert from "node:assert/strict";
import { createTalentAgent } from "../src/agent/orchestrator/talent-agent.ts";

function fakeLinkedIn() {
  const calls = [];
  return {
    calls,
    async searchJobs(filters) {
      calls.push(["search", filters]);
      return [{ jobId: 101 }, { id: "202" }];
    },
    async getJobDetails(jobId) {
      calls.push(["details", jobId]);
      return { jobId, title: `Job ${jobId}` };
    },
  };
}

test("central talent agent delegates LinkedIn search to Agent Reach client", async () => {
  const linkedin = fakeLinkedIn();
  const agent = createTalentAgent({ linkedin });

  const result = await agent.searchLinkedInJobs({
    keywords: "software engineer",
    location: "India",
    filters: { workplace: "remote" },
  });

  assert.deepEqual(result, [{ jobId: 101 }, { id: "202" }]);
  assert.deepEqual(linkedin.calls[0], ["search", {
    keywords: "software engineer",
    location: "India",
    workplace: "remote",
  }]);
});

test("central talent agent fetches details for discovered job ids", async () => {
  const linkedin = fakeLinkedIn();
  const agent = createTalentAgent({ linkedin });

  const result = await agent.discoverLinkedInJobs({ keywords: "backend engineer" });

  assert.deepEqual(result, [
    { jobId: 101, title: "Job 101" },
    { jobId: "202", title: "Job 202" },
  ]);
  assert.deepEqual(linkedin.calls.map((call) => call[0]), ["search", "details", "details"]);
});
