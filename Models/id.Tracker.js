import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
  {
    UserIp: {
      type: String,
      required: true
    },

    windowStart: {
      type: Date,
      required: true
    },

    windowEnd: {
      type: Date,
      required: true
    },

    RequestCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    isBlocked: {
      type: Boolean,
      required: true,
      default: false
    },

    // زمان پایان مسدودسازی
    blockTime: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// برای هر IP فقط یک Tracker نگه می‌داریم.
trackerSchema.index(
  { UserIp: 1 },
  { unique: true, name: "unique_tracker_ip" }
);

export const IpTracker = mongoose.model(
  "IpTracker",
  trackerSchema
);