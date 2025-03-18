'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full min-h-[90vh] flex items-center justify-center py-16 md:py-24 overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-[50rem] mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge 
            variant="outline" 
            className="inline-flex mx-auto bg-background/80 backdrop-blur-sm"
          >
            Season 2024 Now Live
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl lg:leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Race Beyond Limits <br className="hidden sm:inline" />
            in Blur Racing
          </h1>
          <p className="text-xl text-muted-foreground max-w-[40rem] mx-auto">
            Experience the ultimate racing thrill with power-ups, stunning tracks, 
            and intense multiplayer action. Your journey to racing glory starts now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto min-w-[180px] h-12 text-base rounded-full bg-primary hover:bg-primary/90"
            >
              <Link href="/sign-in">
                Start Racing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="w-full sm:w-auto min-w-[180px] h-12 text-base rounded-full border-primary/20 hover:bg-primary/10"
            >
              <Link href="/about">Watch Trailer</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 