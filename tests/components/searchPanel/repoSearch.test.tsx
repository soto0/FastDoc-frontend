import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockRepo } from "@tests/helpers/testHelper";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RepoSearch from "@/components/searchPanel/repoSearch";

const { getReposMock } = vi.hoisted(() => ({
  getReposMock: vi.fn(),
}));

vi.mock("@/api/getRepos", () => ({
  getRepos: getReposMock,
}));

describe("repoSearch", () => {
  beforeEach(() => {
    getReposMock.mockReset();
  });

  it("does not search when query is shorter than 3 characters", async () => {
    render(<RepoSearch open setOpen={vi.fn()} setRepo={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Введите название пакета"), {
      target: { value: "ab" },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(getReposMock).not.toHaveBeenCalled();
  });

  it("debounces repository search", async () => {
    getReposMock.mockResolvedValue([mockRepo()]);

    render(<RepoSearch open setOpen={vi.fn()} setRepo={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Введите название пакета"), {
      target: { value: "next" },
    });

    expect(getReposMock).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(getReposMock).toHaveBeenCalledWith("next");
      },
      { timeout: 1000 },
    );
  });

  it("selects a repository and closes the dialog", async () => {
    const repo = mockRepo({ id: 5, repo: "vue", owner: "vuejs" });
    getReposMock.mockResolvedValue([repo]);
    const setOpen = vi.fn();
    const setRepo = vi.fn();

    render(<RepoSearch open setOpen={setOpen} setRepo={setRepo} />);

    fireEvent.change(screen.getByPlaceholderText("Введите название пакета"), {
      target: { value: "vue" },
    });

    await waitFor(() => {
      expect(screen.getByText("vue")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("vue"));

    expect(setRepo).toHaveBeenCalledWith(repo);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
