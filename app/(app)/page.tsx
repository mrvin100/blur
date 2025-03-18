import { HeroSection, StatsSection } from "@/modules/home";

export default function Page() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <div className="flex-1 pb-16">
        <HeroSection />
        <StatsSection />
      </div>
    </main>
  );
}
