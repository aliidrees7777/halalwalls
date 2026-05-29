import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-emerald-500">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        This halal spot doesn&apos;t exist on our map yet.
      </p>
      <Button
        className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Back to Home
      </Button>
    </div>
  );
}
