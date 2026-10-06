import { Compass } from "lucide-react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import TrackForm from "@/components/modules/tracking/track-form";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <div
          aria-hidden="true"
          className="cg-grid-bg absolute inset-x-[-50vw] inset-y-0 -z-10"
        />
        <span className="cg-float rounded-3xl bg-primary/10 p-5 text-primary ring-8 ring-primary/5">
          <Compass className="size-10" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            This page took a wrong turn
          </h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
        </div>
        <div className="w-full space-y-2">
          <p className="text-sm text-muted-foreground">
            Looking for a parcel? Track it here:
          </p>
          <TrackForm />
        </div>
        <LinkButton href="/" variant="outline">
          Back to home
        </LinkButton>
      </main>
      <Footer />
    </div>
  );
}
