import { mockRepo } from "@tests/helpers/testHelper";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock("@/utils/apiClient", () => ({
  apiClient: {
    get: getMock,
  },
}));

describe("getRepos", () => {
  beforeEach(async () => {
    getMock.mockReset();
    vi.resetModules();
  });

  it("returns repositories from the API payload", async () => {
    const repos = [mockRepo()];
    getMock.mockResolvedValueOnce({ data: { payload: repos } });

    const { getRepos } = await import("@/api/getRepos");
    const result = await getRepos("next");

    expect(result).toEqual(repos);
    expect(getMock).toHaveBeenCalledWith("/repos/search", {
      params: { query: "next" },
      signal: expect.any(AbortSignal),
    });
  });

  it("aborts the previous request when called again", async () => {
    let firstSignal: AbortSignal | undefined;
    let secondSignal: AbortSignal | undefined;

    getMock.mockImplementationOnce(async (_url, config) => {
      firstSignal = config.signal;
      return new Promise(() => {});
    });
    getMock.mockImplementationOnce(async (_url, config) => {
      secondSignal = config.signal;
      return Promise.resolve({ data: { payload: [] } });
    });

    const { getRepos } = await import("@/api/getRepos");

    void getRepos("next");
    await getRepos("react");

    expect(firstSignal?.aborted).toBe(true);
    expect(secondSignal?.aborted).toBe(false);
  });
});
