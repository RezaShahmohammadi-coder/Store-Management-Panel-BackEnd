import { findTracker } from "./Tracker.Repository.js";
function readPositiveInteger(name) {
  const value = Number(process.env[name]);

  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(
      `${name} must be a positive integer`
    );
  }

  return value;
}

export async function trackerService(ip) {
  if (typeof ip !== "string" || ip.length === 0) {
    throw new Error("A valid client IP is required");
  }

  const maxReq = readPositiveInteger("MAX_REQUESTS");
  const windowMs = readPositiveInteger("WINDOW_MS");
  const blockMs = readPositiveInteger("BLOCK_TIME_MS");

  const tracker = await findTracker(
    ip,
    maxReq,
    windowMs,
    blockMs
  );

  const now = Date.now();

  if (tracker.isBlocked && tracker.blockTime > now) {
    return {
      allowed: false,
      tracker,
      retryAfterMs: tracker.blockTime.getTime() - now
    };
  }

  return {
    allowed: true,
    tracker,
    retryAfterMs: 0
  };

}