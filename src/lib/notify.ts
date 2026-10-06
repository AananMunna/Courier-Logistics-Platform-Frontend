import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/utils/error.util";

/** Thin wrapper so every screen shows toasts the same way. */
export const notify = {
  success(title: string, description?: string) {
    toast.add({ title, description, type: "success" });
  },
  info(title: string, description?: string) {
    toast.add({ title, description, type: "info" });
  },
  error(
    title: string,
    error?: unknown,
    overrides?: Partial<Record<number, string>>,
  ) {
    toast.add({
      title,
      description:
        error === undefined ? undefined : getErrorMessage(error, overrides),
      type: "error",
    });
  },
};
