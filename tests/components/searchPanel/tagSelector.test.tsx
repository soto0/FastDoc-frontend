import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TagSelector from "@/components/searchPanel/tagSelector";

const { useReleasesMock } = vi.hoisted(() => ({
  useReleasesMock: vi.fn(),
}));

vi.mock("@/hooks/useReleasesSelector", () => ({
  useReleases: useReleasesMock,
}));

describe("tagSelector", () => {
  beforeEach(() => {
    useReleasesMock.mockReturnValue({
      selected: null,
      releases: [],
      isLoading: false,
      listRef: { current: null },
      handleScroll: vi.fn(),
      selectRelease: vi.fn(),
    });
  });

  it("disables the trigger when repository is not selected", () => {
    render(<TagSelector setTag={vi.fn()} />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("shows the selected release name", () => {
    useReleasesMock.mockReturnValue({
      selected: { id: 1, tag: "v14.0.0", name: "Release 14" },
      releases: [],
      isLoading: false,
      listRef: { current: null },
      handleScroll: vi.fn(),
      selectRelease: vi.fn(),
    });

    render(
      <TagSelector repo="next.js" owner="vercel" tag="v14.0.0" setTag={vi.fn()} />,
    );

    expect(screen.getByRole("combobox")).not.toBeDisabled();
    expect(screen.getByText("Release 14")).toBeInTheDocument();
  });
});
