import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NewPartyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Party</h1>
        <Card>
          <CardHeader>
            <CardTitle>Party Details</CardTitle>
            <CardDescription>Set up a new racing party and invite players</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Form content would go here */}
              <div className="flex justify-end space-x-4">
                <Link href="/party">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Create Party</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

