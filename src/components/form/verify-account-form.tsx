"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import {
  useRefreshSession,
  useVerifyAccount,
  useVerifyRiderAccount,
} from "@/hooks";
import { notify } from "@/lib/notify";

const OTP_LIFETIME_SECONDS = 5 * 60;

interface Props {
  mode: "customer" | "rider";
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function VerifyAccountForm({ mode }: Props) {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_LIFETIME_SECONDS);

  const refreshSession = useRefreshSession();
  const { mutateAsync: verifyCustomer, isPending: customerPending } =
    useVerifyAccount();
  const { mutateAsync: verifyRider, isPending: riderPending } =
    useVerifyRiderAccount();
  const isPending = customerPending || riderPending;

  useEffect(() => {
    if (!email) {
      router.replace(mode === "rider" ? "/apply" : "/register");
    }
  }, [email, mode, router]);

  useEffect(() => {
    const timer = setInterval(
      () => setSecondsLeft((previous) => Math.max(previous - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  if (!email) {
    return null;
  }

  const expired = secondsLeft === 0;
  const restartHref = mode === "rider" ? "/apply" : "/register";

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setInvalid(true);
      return;
    }

    try {
      if (mode === "rider") {
        await verifyRider({ email, otp });
        notify.success(
          "Application submitted",
          "We'll email you as soon as it's reviewed.",
        );
        router.replace("/login");
        return;
      }

      await verifyCustomer({ email, otp });
      const user = await refreshSession();
      notify.success("Email verified", `Welcome aboard, ${user.name}!`);
      router.replace("/dashboard");
    } catch (error) {
      notify.error("Verification failed", error, {
        400: "That code is wrong or has expired. Check your email or start over.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="cg-pop rounded-2xl bg-primary/10 p-4 text-primary ring-8 ring-primary/5">
          <MailCheck className="size-7" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="space-y-5"
      >
        <Field data-invalid={invalid} className="items-center">
          <FieldLabel htmlFor="otp" className="sr-only">
            Verification code
          </FieldLabel>
          <InputOTP
            id="otp"
            name="otp"
            maxLength={6}
            value={otp}
            autoFocus
            autoComplete="one-time-code"
            pattern={REGEXP_ONLY_DIGITS}
            disabled={isPending || expired}
            onChange={(value) => {
              setOtp(value);
              setInvalid(false);
            }}
            onComplete={() => void handleSubmit()}
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {invalid && (
            <FieldError errors={[{ message: "Enter all 6 digits." }]} />
          )}
          <FieldDescription className="text-center">
            {expired
              ? "This code has expired."
              : `Code expires in ${formatCountdown(secondsLeft)}`}
          </FieldDescription>
        </Field>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-base shadow-[0_10px_24px_-12px_var(--primary)]"
          disabled={isPending || expired}
        >
          {isPending ? (
            <>
              <Spinner /> Verifying…
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {expired ? "Code expired — " : "Didn't get it? Check spam, or "}
        <Link
          href={restartHref}
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          start over
        </Link>
      </p>
    </div>
  );
}
