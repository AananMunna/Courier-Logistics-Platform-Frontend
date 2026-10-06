"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL } from "@/constants";
import { useCurrentUser, useLogout } from "@/hooks";
import { notify } from "@/lib/notify";

export function UserMenu() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        notify.success("Logged out", "See you soon!");
        router.replace("/login");
      },
    });
  };

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 p-2.5 ring-1 ring-foreground/5">
      <Avatar
        name={user.name}
        src={user.imageUrl}
        className="size-9 ring-2 ring-primary/20"
        size={36}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {ROLE_LABEL[user.role]}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleLogout}
        disabled={isPending}
        aria-label="Log out"
      >
        <LogOut />
      </Button>
    </div>
  );
}
