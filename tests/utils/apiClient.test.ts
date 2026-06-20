import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/utils/apiClient";

const { toastErrorMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
  },
}));

describe("apiClient interceptor", () => {
  beforeEach(() => {
    toastErrorMock.mockReset();
  });

  it("shows API error message from the response body", async () => {
    apiClient.defaults.adapter = async () =>
      Promise.reject(
        Object.assign(new Error("Request failed"), {
          isAxiosError: true,
          response: { data: { error: "Репозитории не найдены" } },
          config: {},
          name: "AxiosError",
          toJSON: () => ({}),
        }),
      );

    await expect(apiClient.get("/repos/search")).rejects.toBeDefined();

    expect(toastErrorMock).toHaveBeenCalledWith("Ошибка", {
      description: "Репозитории не найдены",
    });
  });
});
