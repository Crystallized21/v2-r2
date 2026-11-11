export type UnlockStatus = "idle" | "ok" | "wrong" | "locked" | "failed";

export type UnlockState = {
  status: UnlockStatus;
  attempt: number;
};
