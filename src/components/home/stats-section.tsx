import { stats } from "@/data/categories";
import { FadeIn } from "@/components/shared/motion-wrapper";

export function StatsSection() {
  return (
    <section className="border-y border-border/40 bg-muted/20 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
