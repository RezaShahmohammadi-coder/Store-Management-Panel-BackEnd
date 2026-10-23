import { IpTracker } from "../Models/id.Tracker.js";

const INITIAL_DATE = new Date(0);

export async function findTracker(ip, maxReq, windowMs, blockMs) {
  const now = new Date();
  const nextWindowEnd = new Date(now.getTime() + windowMs);
  const blockUntil = new Date(now.getTime() + blockMs);

  // اگر IP جدید است، یک سند اولیه بساز.
  // برای درخواست‌های هم‌زمان، ایندکس یکتا از تکرار سند جلوگیری می‌کند.
  try {
    await IpTracker.updateOne(
      { UserIp: ip },
      {
        $setOnInsert: {
          UserIp: ip,
          windowStart: INITIAL_DATE,
          windowEnd: INITIAL_DATE,
          RequestCount: 0,
          isBlocked: false,
          blockTime: null
        }
      },
      { upsert: true }
    );
  } catch (error) {
    // درخواست هم‌زمان دیگری ممکن است سند را زودتر ساخته باشد.
    if (error.code !== 11000) {
      throw error;
    }
  }

  // یک سند را اتمیک بررسی و به‌روزرسانی کن.
  const tracker = await IpTracker.findOneAndUpdate(
    { UserIp: ip },
    [
      {
        $set: {
          _currentlyBlocked: {
            $and: [
              { $eq: ["$isBlocked", true] },
              { $gt: ["$blockTime", now] }
            ]
          }
        }
      },
      {
        $set: {
          _shouldResetWindow: {
            $or: [
              {
                $and: [
                  { $lte: ["$windowEnd", now] },
                  { $eq: ["$_currentlyBlocked", false] }
                ]
              },
              {
                $and: [
                  { $eq: ["$isBlocked", true] },
                  { $lte: ["$blockTime", now] }
                ]
              }
            ]
          }
        }
      },
      {
        $set: {
          windowStart: {
            $cond: [
              "$_shouldResetWindow",
              now,
              "$windowStart"
            ]
          },

          windowEnd: {
            $cond: [
              "$_shouldResetWindow",
              nextWindowEnd,
              "$windowEnd"
            ]
          }
        }
      },
      {
        $set: {
          RequestCount: {
            $cond: [
              "$_currentlyBlocked",
              "$RequestCount",
              {
                $cond: [
                  "$_shouldResetWindow",
                  1,
                  {
                    $cond: [
                      { $lt: ["$RequestCount", maxReq] },
                      { $add: ["$RequestCount", 1] },
                      "$RequestCount"
                    ]
                  }
                ]
              }
            ]
          },

          isBlocked: {
            $cond: [
              "$_currentlyBlocked",
              true,
              {
                $cond: [
                  "$_shouldResetWindow",
                  false,
                  { $gte: ["$RequestCount", maxReq] }
                ]
              }
            ]
          },

          blockTime: {
            $cond: [
              "$_currentlyBlocked",
              "$blockTime",
              {
                $cond: [
                  "$_shouldResetWindow",
                  null,
                  {
                    $cond: [
                      { $gte: ["$RequestCount", maxReq] },
                      blockUntil,
                      "$blockTime"
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $unset: [
          "_currentlyBlocked",
          "_shouldResetWindow"
        ]
      }
    ],
    {
      returnDocument: "after",
      updatePipeline: true,
    }
  );

  return tracker;
}