import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Github, AlertCircle } from "lucide-react"
import Link from "next/link"
import { fetchAllContributors, type Contributor } from "@/lib/github"

const TELEGRAM_GROUP = "https://t.me/+b7cUePP1Q8BlMTlk"

interface ContributorAvatarProps {
  contributor: Contributor
  repoType: "frontend" | "backend"
}

function ContributorAvatar({ contributor, repoType }: ContributorAvatarProps) {
  const contributions = contributor.repos.includes(repoType) 
    ? contributor.contributions 
    : 0

  return (
    <div className="flex flex-col items-center gap-2 group">
      <Link
        href={contributor.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
        title={`${contributor.username} - ${contributions} contributions`}
      >
        <Avatar className="size-16 border-2 border-border hover:border-primary transition-all duration-300 hover:scale-110">
          <AvatarImage src={contributor.avatarUrl} alt={contributor.username} />
          <AvatarFallback>{contributor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        {contributions > 0 && (
          <Badge 
            variant="default" 
            className="absolute -top-1 -right-1 size-6 flex items-center justify-center p-0 text-xs font-bold rounded-full"
          >
            {contributions}
          </Badge>
        )}
      </Link>
      
      <Link
        href={contributor.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium hover:text-primary transition-colors text-center max-w-[80px] truncate"
      >
        {contributor.username}
      </Link>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-muted-foreground">Failed to load contributors. Please try again later.</p>
    </div>
  )
}

export async function ContributorsSection() {
  let contributorsData
  
  try {
    contributorsData = await fetchAllContributors()
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return (
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <ErrorState />
        </div>
      </section>
    )
  }

  const { frontend, backend, all } = contributorsData

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">
            Built by the Community <br /> for the Community
          </h2>
          <p className="mt-6 text-muted-foreground">
            Meet the amazing developers who made this project possible through their valuable contributions.
          </p>
        </div>

        {/* Backend Contributors */}
        {backend.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <h3 className="px-6 text-xl font-semibold text-muted-foreground">Backend Contributors</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8">
              {backend.map((contributor) => (
                <ContributorAvatar 
                  key={`backend-${contributor.username}`} 
                  contributor={contributor}
                  repoType="backend"
                />
              ))}
            </div>
          </div>
        )}

        {/* Frontend Contributors */}
        {frontend.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <h3 className="px-6 text-xl font-semibold text-muted-foreground">Frontend Contributors</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8">
              {frontend.map((contributor) => (
                <ContributorAvatar 
                  key={`frontend-${contributor.username}`} 
                  contributor={contributor}
                  repoType="frontend"
                />
              ))}
            </div>
          </div>
        )}

        {/* Community Footer */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <Github className="size-4" />
                Repositories
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <Link 
                    href="https://github.com/mrvin100/blur" 
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Frontend Repository
                  </Link>
                </div>
                <div>
                  <Link 
                    href="https://github.com/jakemelvin/burApp" 
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Backend Repository
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Tech Stack</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Next.js 16 + TypeScript</div>
                <div>Spring Boot + PostgreSQL</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Community</h4>
              <Link 
                href={TELEGRAM_GROUP} 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Join Telegram Group →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
