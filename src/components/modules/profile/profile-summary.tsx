"use client";

import { BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ROLE_LABEL } from "@/constants";
import { useCurrentUser } from "@/hooks";
import { formatDate } from "@/utils";

/** Identity card shown inside the dark profile hero. */
export function ProfileSummary() {
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <p className="text-sm text-ink-foreground/70">Loading your profile…</p>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        name={user.name}
        src={user.imageUrl}
        className="size-14 text-lg ring-4 ring-white/10"
        size={56}
      />
      <div className="min-w-0 space-y-1">
        <p className="truncate font-semibold">{user.name}</p>
        <p className="truncate text-sm text-ink-foreground/70">{user.email}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-foreground/70">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-medium text-ink-foreground">
            <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
            {ROLE_LABEL[user.role]}
          </span>
          {user.createdAt && (
            <span>Member since {formatDate(user.createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
