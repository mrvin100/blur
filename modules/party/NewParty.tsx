"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParty } from "@/hooks/useParty";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Party } from "@/types/party.types";

export function NewPartyPage() {
  const { createParty, fetchAllParties } = useParty();
  const router = useRouter();
  const checkTodaysParty = () => {
    const allParties = fetchAllParties.data || [];
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
    const todaysParty = allParties.find((party: Party) => {
      const partyDate = new Date(party.datePlayed);
      const partyDateString = partyDate.toISOString().split("T")[0];
      return partyDateString === todayDateString;
    });
    if (todaysParty) {
      router.push(`/dashboard/party/${todaysParty.id}`);
      toast.error("Une partie a déjà été créée aujourd'hui", {
        description: "Nous vous redigons vers celle ci",
      });
    }
  };

  useEffect(() => {
    if (fetchAllParties.isSuccess) {
      checkTodaysParty();
    }
  }, [fetchAllParties.isSuccess, checkTodaysParty]);
  const handleCreate = async (e: React.MouseEvent) => {
    // Modification ici
    e.preventDefault(); // Empêche la soumission du formulaire

    try {
      const newParty = await createParty.mutateAsync();
      console.log("Nouvelle partie crée", newParty);
      toast.success("Succès", {
        description: "La Partie a été créée avec succès",
      });

      // Redirection côté client
      router.push(`/dashboard/party/${newParty.id}`);
    } catch (error) {
      toast.error(error as string);
      console.error("Erreur détaillée:", error);
    }
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Create New Party
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Party Details</CardTitle>
            <CardDescription>
              Set up a new racing party and invite players
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  onClick={(e) => handleCreate(e)}
                >
                  Create Party
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
