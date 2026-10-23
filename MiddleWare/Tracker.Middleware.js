import { trackerService } from "../Tracker/Tracker.service.js";

export async function tracker(req, res, next) {
  try {
    const ip = req.ip;

    const result = await trackerService(ip);

    req.rateLimit = result;

    if (!result.allowed) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil(result.retryAfterMs / 1000)
      );

      res.setHeader("Retry-After", retryAfterSeconds);

      return res.status(429).json({
        success: false,
        message: "تعداد درخواست های شما بیش تر از حد مجاز است. اکانت شما تا اطلاع ثانوی بلاک شده است...",
        retryAfterSeconds
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}