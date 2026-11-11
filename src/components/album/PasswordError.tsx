import { UnlockStatus } from "@/types/unlock";

function getMessage(status: UnlockStatus) {
  if (status === "wrong") {
    return "That isn't it. Check the message the password came in.";
  }

  if (status === "failed") {
    return "Something went wrong on our side. Try again in a moment.";
  }

  return null;
}

export default function PasswordError({ status }: { status: UnlockStatus }) {
  const message = getMessage(status);

  if (!message) {
    return null;
  }

  return (
    <p
      id="password-error"
      role="alert"
      className="text-sm text-destructive motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-300"
    >
      {message}
    </p>
  );
}
