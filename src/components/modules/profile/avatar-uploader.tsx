"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useUploadProfileImage } from "@/hooks";
import { notify } from "@/lib/notify";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE_MB,
  validateAvatarFile,
} from "@/validation";

export function AvatarUploader() {
  const { user } = useCurrentUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { mutate: upload, isPending } = useUploadProfileImage();

  if (!user) {
    return null;
  }

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const problem = validateAvatarFile(file);
    if (problem) {
      notify.error("Choose a different image", new Error(problem));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setProgress(0);

    upload(
      { file, onProgress: setProgress },
      {
        onSuccess: () => notify.success("Profile photo updated"),
        onError: (error) => {
          setPreview(null);
          notify.error("Upload failed", error);
        },
        onSettled: () => {
          URL.revokeObjectURL(objectUrl);
          setPreview(null);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-muted/40 p-4">
      <div className="relative">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview cannot use next/image
          <img
            src={preview}
            alt="Selected file preview"
            className="size-20 rounded-full object-cover ring-4 ring-primary/10"
          />
        ) : (
          <Avatar
            name={user.name}
            src={user.imageUrl}
            className="size-20 text-xl ring-4 ring-primary/10"
            size={80}
          />
        )}
        {isPending && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70 text-xs font-semibold">
            {progress}%
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          aria-label="Upload profile photo"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? <Spinner /> : <Camera />}{" "}
          {isPending ? "Uploading…" : "Change photo"}
        </Button>
        <p className="text-xs text-muted-foreground">
          PNG, JPG or WebP · max {MAX_AVATAR_SIZE_MB} MB
        </p>
      </div>
    </div>
  );
}
