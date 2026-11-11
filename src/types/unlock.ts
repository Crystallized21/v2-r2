// What the unlock server action sends back to the password form.
//
// idle   - nothing submitted yet
// ok     - password was correct
// wrong  - password was incorrect (or the album doesn't exist)
// failed - something broke on our side (database down, etc.)
//
// `attempt` goes up by one on every submit. The form uses it to replay
// the shake animation and to know when the visitor has retyped.
export type UnlockStatus = "idle" | "ok" | "wrong" | "failed";

export type UnlockState = {
  status: UnlockStatus;
  attempt: number;
};
