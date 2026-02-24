import { render, screen } from "@testing-library/react";
import HomeClient from "@/components/HomeClient";
import Providers from "@/components/Providers";

jest.mock("@/components/ReposDashboard", () => {
  const MockDashboard = () => <div>Mock Dashboard</div>;
  MockDashboard.displayName = "MockDashboard";
  return MockDashboard;
});

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Test User" } } }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("HomeClient", () => {
  it("renders welcome message when session exists", () => {
    render(
      <Providers>
        <HomeClient />
      </Providers>
    );

    expect(screen.getByText(/Welcome Test User/)).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/)).toBeInTheDocument();
    expect(screen.getByText("Mock Dashboard")).toBeInTheDocument();
  });
});
