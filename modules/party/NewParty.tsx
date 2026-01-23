"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParties, useTodayParty } from "@/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Party } from "@/types/party.types";
import { Car, Flag, Users, Zap, Trophy, Loader2 } from "lucide-react";
import { ApiErrorState } from "@/components/ui/error-states";

export function NewPartyPage() {
  const { data: allParties, isSuccess, isError: isAllPartiesError, error: allPartiesError } = useParties();
  const { data: todayParty, refetch: fetchTodayParty, isError: isTodayError, error: todayError } = useTodayParty();
  const [disabled, setDisabled] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  
  const checkTodaysParty = () => {
    const parties = allParties || [];
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
    const todaysParty = parties.find((party: Party) => {
      const partyDate = new Date(party.datePlayed);
      const partyDateString = partyDate.toISOString().split("T")[0];
      return partyDateString === todayDateString;
    });
    if (todaysParty) {
      setDisabled(true);
      router.push(`/dashboard/party/${todaysParty.id}`);
      toast.error("Une partie a déjà été créée aujourd'hui", {
        description: "Nous vous redirigeons vers celle-ci",
      });
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (isSuccess && allParties) {
      checkTodaysParty();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, allParties]);

  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Backend's getTodayParty creates a party if it doesn't exist
      const { data } = await fetchTodayParty();
      if (data) {
        router.push(`/dashboard/party/${data.id}`);
      }
    } catch {
      toast.error("Failed to create party");
      setIsCreating(false);
    }
  };

  const features = [
    { icon: Users, label: "Invite Players", description: "Add racers to compete" },
    { icon: Car, label: "Car Selection", description: "Random or manual assignment" },
    { icon: Flag, label: "Track Roulette", description: "Discover new circuits" },
    { icon: Trophy, label: "Score Tracking", description: "Real-time leaderboard" },
  ];

  if (isAllPartiesError || isTodayError) {
    return (
      <div className="flex items-center justify-center py-10">
        <ApiErrorState error={todayError ?? allPartiesError ?? new Error('Failed to load parties')} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-neutral-900 p-6 sm:p-8 md:p-10">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-zinc-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Racing Lines Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
          <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/10 to-transparent" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Create New Party
            </h1>
          </div>
          <p className="text-zinc-300 text-sm sm:text-base max-w-lg">
            Start a new racing session with your friends. Set up the party, invite players, and let the competition begin!
          </p>
        </div>

        {/* Car Silhouette */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-20">
          <Car className="h-20 w-20 sm:h-28 sm:w-28 text-white" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div 
              key={feature.label}
              className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-accent/50 transition-colors"
            >
              <Icon className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="font-medium text-sm">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Party Details Card */}
      <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-card to-muted/20">
        <CardHeader className="p-4 sm:p-6 text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Flag className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Ready to Race?</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Click the button below to create your racing party for today
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="cursor-pointer w-full sm:w-auto min-w-[140px]"
              >
                Cancel
              </Button>
            </Link>
            <Button
              className="cursor-pointer w-full sm:w-auto min-w-[160px] bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white shadow-lg"
              onClick={(e) => handleCreate(e)}
              disabled={disabled || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Launch Party
                </>
              )}
            </Button>
          </div>
          
          {/* Info Note */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            Note: Only one party can be created per day
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
