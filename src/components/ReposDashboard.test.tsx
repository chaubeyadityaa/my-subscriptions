import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ImageProps } from "next/image";
import axios from "axios";
import ReposDashboard from "@/components/ReposDashboard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => <div data-testid="mock-image" data-alt={String(props.alt)} />,
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ReposDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders repositories returned by the insights API", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "Repo1",
          description: "desc1",
          owner: { login: "user1", avatar_url: "avatar1.png" },
          html_url: "https://github.com/user1/repo1",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
          summary: "This is a summary",
          summaryStatus: "ok",
          keywords: ["keyword1", "keyword2"],
        },
      ],
    });

    render(<ReposDashboard />);

    expect(await screen.findByText("Repo1")).toBeInTheDocument();
    expect(await screen.findByText(/This is a summary/)).toBeInTheDocument();
    expect(await screen.findByText(/keyword1/)).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/repo-insights");
  });

  it("supports searching repos", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "Alpha",
          description: "first",
          owner: { login: "user1", avatar_url: "avatar1.png" },
          html_url: "https://github.com/user1/alpha",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
          summary: "summary",
          summaryStatus: "ok",
          keywords: [],
        },
        {
          id: 2,
          name: "Beta",
          description: "second",
          owner: { login: "user2", avatar_url: "avatar2.png" },
          html_url: "https://github.com/user2/beta",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
          summary: "summary",
          summaryStatus: "ok",
          keywords: [],
        },
      ],
    });

    render(<ReposDashboard />);
    await screen.findByText("Alpha");

    fireEvent.change(screen.getByLabelText("Search repositories"), {
      target: { value: "beta" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });
  });

  it("shows retry button on failed fetch", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("network error"));

    render(<ReposDashboard />);

    expect(await screen.findByText(/Failed to load repository insights/)).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });
});
