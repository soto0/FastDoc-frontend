import { beforeEach, describe, expect, it, vi } from "vitest";

import { getChangelog } from "@/api/getChangelog";

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock("@/utils/apiClient", () => ({
  apiClient: {
    get: getMock,
  },
}));

describe("getChangelog", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("returns changelog payload from the API", async () => {
    getMock.mockResolvedValueOnce({
      data: { payload: { changelog: "## Bug Fixes" } },
    });

    const result = await getChangelog({
      repo: "next.js",
      owner: "vercel",
      tag: "v14.0.0",
    });

    expect(result).toEqual({ changelog: "## Bug Fixes" });
    expect(getMock).toHaveBeenCalledWith("repos/changelog", {
      params: { repo: "next.js", owner: "vercel", tag: "v14.0.0" },
    });
  });
});
