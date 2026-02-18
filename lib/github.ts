export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface Contributor {
  username: string;
  avatarUrl: string;
  githubUrl: string;
  contributions: number;
  repos: ('frontend' | 'backend')[];
}

const GITHUB_API_BASE = 'https://api.github.com';
const BACKEND_REPO = 'jakemelvin/burApp';
const FRONTEND_REPO = 'mrvin100/blur';

async function fetchRepoContributors(repo: string): Promise<GitHubContributor[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}/contributors`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contributors for ${repo}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching contributors for ${repo}:`, error);
    return [];
  }
}

export async function fetchAllContributors(): Promise<{
  frontend: Contributor[];
  backend: Contributor[];
  all: Contributor[];
}> {
  const [backendContributors, frontendContributors] = await Promise.all([
    fetchRepoContributors(BACKEND_REPO),
    fetchRepoContributors(FRONTEND_REPO),
  ]);

  const contributorMap = new Map<string, Contributor>();

  // Process backend contributors
  backendContributors.forEach((contributor) => {
    contributorMap.set(contributor.login, {
      username: contributor.login,
      avatarUrl: contributor.avatar_url,
      githubUrl: contributor.html_url,
      contributions: contributor.contributions,
      repos: ['backend'],
    });
  });

  // Process frontend contributors
  frontendContributors.forEach((contributor) => {
    const existing = contributorMap.get(contributor.login);
    if (existing) {
      existing.repos.push('frontend');
      existing.contributions += contributor.contributions;
    } else {
      contributorMap.set(contributor.login, {
        username: contributor.login,
        avatarUrl: contributor.avatar_url,
        githubUrl: contributor.html_url,
        contributions: contributor.contributions,
        repos: ['frontend'],
      });
    }
  });

  const allContributors = Array.from(contributorMap.values()).sort(
    (a, b) => b.contributions - a.contributions
  );

  return {
    frontend: allContributors.filter((c) => c.repos.includes('frontend')),
    backend: allContributors.filter((c) => c.repos.includes('backend')),
    all: allContributors,
  };
}
