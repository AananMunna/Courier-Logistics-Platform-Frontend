"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateMyRiderProfile } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Rider } from "@/types";

export function AvailabilityToggle({ rider }: { rider: Rider }) {
  const { mutate: update } = useUpdateMyRiderProfile();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="relative mt-1.5 flex size-2.5 shrink-0">
          {rider.isAvailable && (
            <span
              aria-hidden="true"
              className="cg-ping absolute inline-flex size-full rounded-full bg-emerald-400"
            />
          )}
          <span
            aria-hidden="true"
            className={
              rider.isAvailable
                ? "relative inline-flex size-2.5 rounded-full bg-emerald-400"
                : "relative inline-flex size-2.5 rounded-full bg-white/30"
            }
          />
        </span>
        <div>
          <p className="font-semibold">
            {rider.isAvailable ? "You're online" : "You're offline"}
          </p>
          <p className="text-sm text-ink-foreground/70">
            {rider.isAvailable
              ? "Admins can assign new parcels to you."
              : "Turn this on when you're ready to take deliveries."}
          </p>
        </div>
      </div>
      <Switch
        aria-label="Available for deliveries"
        checked={rider.isAvailable}
        onCheckedChange={(checked) =>
          update(
            { isAvailable: checked },
            {
              onSuccess: () =>
                notify.success(checked ? "You're online" : "You're offline"),
              onError: (error) =>
                notify.error("Couldn't update availability", error),
            },
          )
        }
      />
    </div>
  );
}
