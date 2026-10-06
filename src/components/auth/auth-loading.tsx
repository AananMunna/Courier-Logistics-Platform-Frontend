import Logo from "@/assets/svg/Logo";
import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({
  label = "Checking your session…",
}: {
  label?: string;
}) {
  return (
    <output className="flex h-screen w-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Logo className="cg-float size-12" />
      <span className="flex items-center gap-2 text-sm">
        <Spinner className="size-4" />
        {label}
      </span>
    </output>
  );
}
