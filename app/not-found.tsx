"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] grid place-items-center bg-background px-4">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground">
            {" "}
            Hey guys where are you going?
            {/* This page could not be found. */}
          </p>
        </div>

        <Button asChild variant="default">
          <Link href="/">Go back home</Link>
        </Button>
      </motion.div>
    </div>
  );
}
