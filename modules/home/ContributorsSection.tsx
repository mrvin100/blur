"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Users, MessageCircle, Code } from "lucide-react"
import Link from "next/link"

const contributors = [
  {
    username: "warEnd237",
    githubUrl: "https://github.com/warEnd237",
  },
  {
    username: "mrvin100",
    githubUrl: "https://github.com/mrvin100",
  },
  {
    username: "jakemelvin",
    githubUrl: "https://github.com/jakemelvin",
  },
]

const repositories = [
  {
    name: "Frontend",
    url: "https://github.com/mrvin100/blur",
    description: "Next.js 16 + TypeScript",
  },
  {
    name: "Backend",
    url: "https://github.com/jakemelvin/burApp",
    description: "Spring Boot + PostgreSQL",
  },
]

const TELEGRAM_GROUP = "https://t.me/+b7cUePP1Q8BlMTlk"

export function ContributorsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold">Contributors</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the amazing developers who made this project possible
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contributors.map((contributor) => (
            <Card key={contributor.username} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  {contributor.username}
                </CardTitle>
                <CardDescription>Project Contributor</CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  href={contributor.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Github className="h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {repositories.map((repo) => (
            <Card key={repo.name} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {repo.name} Repository
                </CardTitle>
                <CardDescription>{repo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={repo.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2">
                    <Github className="h-4 w-4" />
                    Contribute on GitHub
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <MessageCircle className="h-6 w-6" />
              Join Our Community
            </CardTitle>
            <CardDescription className="text-base">
              Connect with other users, share your experiences, and get support
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href={TELEGRAM_GROUP} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                Join Telegram Group
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
