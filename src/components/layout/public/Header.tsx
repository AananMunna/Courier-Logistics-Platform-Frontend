"use client";

import { LayoutDashboard, LogIn, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/assets/svg/Logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { publicNavigation, siteConfig } from "@/config/site";
import { ROLE_HOME } from "@/constants";
import { useCurrentUser } from "@/hooks";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isPending } = useCurrentUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const authActions = isPending ? (
    <Skeleton className="h-8 w-24" />
  ) : user ? (
    <LinkButton href={ROLE_HOME[user.role]}>
      <LayoutDashboard /> Dashboard
    </LinkButton>
  ) : (
    <>
      <LinkButton href="/login" variant="ghost">
        Log in
      </LinkButton>
      <LinkButton
        href="/register"
        size="lg"
        className="h-9 px-4 shadow-[0_8px_24px_-10px_var(--primary)]"
      >
        Get started
      </LinkButton>
    </>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 shadow-[0_8px_30px_-20px_rgb(15_23_42/0.35)] backdrop-blur-xl"
          : "border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="size-8" />
          <span className="text-lg tracking-tight">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {publicNavigation.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              aria-current={isActive(route.url) ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted",
                isActive(route.url)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {authActions}
        </div>

        <ThemeToggle className="ml-auto lg:hidden" />
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-4/5">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
            {publicNavigation.map((route) => (
              <Link
                key={route.url}
                href={route.url}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium hover:bg-muted",
                  isActive(route.url) && "bg-primary/10 text-primary",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 p-4">
            {isPending ? null : user ? (
              <LinkButton
                href={ROLE_HOME[user.role]}
                size="lg"
                className="h-10"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard /> Dashboard
              </LinkButton>
            ) : (
              <>
                <LinkButton
                  href="/register"
                  size="lg"
                  className="h-10"
                  onClick={() => setOpen(false)}
                >
                  Get started
                </LinkButton>
                <LinkButton
                  href="/login"
                  variant="outline"
                  size="lg"
                  className="h-10"
                  onClick={() => setOpen(false)}
                >
                  <LogIn /> Log in
                </LinkButton>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
