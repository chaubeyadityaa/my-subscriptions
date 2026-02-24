import { render, screen } from "@testing-library/react";
import ReposDashboard from "@/components/ReposDashboard";

jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 1,
          name: "Repo1",
          description: "desc1",
          owner: { login: "user1", avatar_url: "avatar1.png" },
          html_url: "https://github.com/user1/repo1",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
        },
        {
          id: 2,
          name: "Repo2",
          description: "desc2",
          owner: { login: "user2", avatar_url: "avatar2.png" },
          html_url: "https://github.com/user2/repo2",
          created_at: "2026-01-03T00:00:00Z",
          updated_at: "2026-01-04T00:00:00Z",
        },
      ],
    })
  ),
  post: jest.fn(() =>
    Promise.resolve({
      data: { summary: "This is a summary" },
    })
  ),
}));

jest.mock("@/lib/keywords", () => ({
  extractKeywords: () => ["keyword1", "keyword2"],
}));

describe("ReposDashboard", () => {
  it("renders repositories with summary and keywords", async () => {
    render(<ReposDashboard />);

    // Check repo names
    expect(await screen.findByText("Repo1")).toBeInTheDocument();
    expect(await screen.findByText("Repo2")).toBeInTheDocument();

    // Check descriptions
    expect(await screen.findByText(/desc1/)).toBeInTheDocument();
    expect(await screen.findByText(/desc2/)).toBeInTheDocument();

    // Check summaries
    expect(await screen.findAllByText(/This is a summary/)).toHaveLength(2);

    // Check keywords
    expect(await screen.findAllByText(/keyword1/)).toHaveLength(2);
    expect(await screen.findAllByText(/keyword2/)).toHaveLength(2);

    // Check owner info
    expect(await screen.findByText("user1")).toBeInTheDocument();
    expect(await screen.findByText("user2")).toBeInTheDocument();
  });
});