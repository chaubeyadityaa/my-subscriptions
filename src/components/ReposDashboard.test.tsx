import { render, screen } from '@testing-library/react';
import ReposDashboard from '@/components/ReposDashboard';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    { id: 1, name: 'Repo1', description: 'desc1' },
    { id: 2, name: 'Repo2', description: 'desc2' }
  ] })),
  post: jest.fn(() => Promise.resolve({ data: { summary: 'summary' } })),
}));

jest.mock('@/lib/keywords', () => ({
  extractKeywords: () => ['keyword1', 'keyword2'],
}));

describe('ReposDashboard', () => {
  it('renders repositories', async () => {
    render(<ReposDashboard />);
    expect(await screen.findByText('Repo1')).toBeInTheDocument();
    expect(await screen.findByText('Repo2')).toBeInTheDocument();
    expect(await screen.findAllByText(/keyword1/)).toHaveLength(2);
  });
});
