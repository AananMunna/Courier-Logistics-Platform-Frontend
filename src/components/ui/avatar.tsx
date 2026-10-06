import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/format.util";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
  /** Pixel size used for the optimised image request. */
  size?: number;
}

function Avatar({ name, src, className, size = 40 }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name ? `${name}'s profile photo` : "Profile photo"}
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}

export { Avatar };
