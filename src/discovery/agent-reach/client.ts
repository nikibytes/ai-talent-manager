import { spawn } from "node:child_process";

export type McpToolResult = unknown;

export interface McpCommandRunner {
  run(args: string[], timeoutMs: number): Promise<string>;
}

class ProcessMcpCommandRunner implements McpCommandRunner {
  run(args: string[], timeoutMs: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(process.env.MCPORTER_BIN ?? "mcporter", args, {
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
      });

      let stdout = "";
      let stderr = "";
      const timer = setTimeout(() => {
        child.kill("SIGTERM");
        reject(new Error(`MCP call timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (code !== 0) {
          reject(new Error(`MCP call failed (${code}): ${stderr.trim() || stdout.trim()}`));
          return;
        }
        resolve(stdout);
      });
    });
  }
}

export interface AgentReachLinkedInClientOptions {
  server?: string;
  timeoutMs?: number;
  runner?: McpCommandRunner;
}

/**
 * Thin application boundary around Agent Reach's configured LinkedIn MCP server.
 * Agent Reach supplies the discovery capability; this client keeps MCP concerns
 * out of the central talent-agent orchestration layer.
 */
export class AgentReachLinkedInClient {
  private readonly server: string;
  private readonly timeoutMs: number;
  private readonly runner: McpCommandRunner;

  constructor(options: AgentReachLinkedInClientOptions = {}) {
    this.server = options.server ?? process.env.AGENT_REACH_MCP_SERVER ?? "linkedin";
    this.timeoutMs = options.timeoutMs ?? Number(process.env.AGENT_REACH_MCP_TIMEOUT_MS ?? 120_000);
    this.runner = options.runner ?? new ProcessMcpCommandRunner();
  }

  async searchJobs(filters: Record<string, unknown> = {}): Promise<McpToolResult> {
    return this.call("jobs.search", filters);
  }

  async getJobDetails(jobId: string | number): Promise<McpToolResult> {
    return this.call("jobs.get", { jobId });
  }

  private async call(tool: string, args: Record<string, unknown>): Promise<McpToolResult> {
    const output = await this.runner.run(
      ["call", `${this.server}.${tool}`, "--args", JSON.stringify(args), "--output", "json"],
      this.timeoutMs,
    );
    return parseMcpOutput(output);
  }
}

export function parseMcpOutput(output: string): unknown {
  const parsed = JSON.parse(output) as unknown;

  if (isRecord(parsed) && Array.isArray(parsed.content)) {
    const textBlock = parsed.content.find(
      (item) => isRecord(item) && item.type === "text" && typeof item.text === "string",
    );
    if (textBlock && isRecord(textBlock) && typeof textBlock.text === "string") {
      try {
        return JSON.parse(textBlock.text);
      } catch {
        return textBlock.text;
      }
    }
  }

  if (isRecord(parsed) && "structuredContent" in parsed) {
    return parsed.structuredContent;
  }

  return parsed;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}
