'use client';

import { motion } from "framer-motion";
import { Car, Timer, Trophy, Users } from "lucide-react";

const stats = [
  {
    value: "60+",
    label: "Race Tracks",
    description: "Unique tracks across the globe",
    icon: Car,
  },
  {
    value: "1M+",
    label: "Active Racers",
    description: "Join the racing community",
    icon: Users,
  },
  {
    value: "24/7",
    label: "Live Races",
    description: "Real-time multiplayer action",
    icon: Timer,
  },
  {
    value: "100K+",
    label: "Daily Tournaments",
    description: "Compete for glory and rewards",
    icon: Trophy,
  },
] as const;

export function StatsSection() {
  return (
    <section className="w-full py-20 md:py-32 relative bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative h-full rounded-2xl border bg-card/50 backdrop-blur-sm p-6 lg:p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                    <div className="p-3 rounded-xl bg-primary/10 inline-flex mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">{stat.value}</h3>
                      <p className="text-lg font-medium">{stat.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 