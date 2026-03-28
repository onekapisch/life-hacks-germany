"use client";

import Hero from "@/components/ui/animated-shader-hero";

export function HeroDemo() {
  return (
    <div className="w-full">
      <Hero
        trustBadge={{
          text: "Trusted by forward-thinking teams.",
          icons: ["✨"],
        }}
        headline={{
          line1: "Launch Your",
          line2: "Workflow Into Orbit",
        }}
        subtitle="Supercharge productivity with AI-powered automation and integrations built for the next generation of teams."
        buttons={{
          primary: {
            text: "Get Started for Free",
          },
          secondary: {
            text: "Explore Features",
          },
        }}
      />
    </div>
  );
}

export default HeroDemo;
