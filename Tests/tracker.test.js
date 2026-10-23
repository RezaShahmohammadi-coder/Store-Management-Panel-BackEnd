
import "dotenv/config";
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";

// تست نباید بدون URI مخصوص تست اجرا شود.
const testUri = process.env.MONGO_URI_TEST;

if (!testUri) {
  throw new Error(
    "MONGO_URI_TEST is required. Configure a dedicated test database."
  );
}

// متغیرهای تست باید پیش از import کردن اپ و سرویس تنظیم شوند.
process.env.MONGO_DB_NAME = "PanelTest";
process.env.MAX_REQUESTS = "3";
process.env.WINDOW_MS = "500";
process.env.BLOCK_TIME_MS = "250";

const { default: app } = await import("../app.js");
const { default: connectDb } = await import("../DataBase/Connect.js");
const { IpTracker } = await import("../Models/id.Tracker.js");
const { trackerService } = await import("../Tracker/Tracker.service.js");

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const uniqueIp = () =>
  `test-${Date.now()}-${Math.random().toString(16).slice(2)}`;

before(async () => {
  await connectDb();

  // احتیاط: این پاک‌سازی فقط باید روی دیتابیس اختصاصی تست انجام شود.
  await IpTracker.deleteMany({});
});

after(async () => {
  try {
    await IpTracker.deleteMany({});
  } finally {
    await mongoose.disconnect();
  }
});

test("1. درخواست چهارم باید 429 بگیرد", async () => {
  await IpTracker.deleteMany({});

  const responses = [];

  for (let i = 0; i < 4; i++) {
    responses.push(await request(app).get("/Products"));
  }

  for (const response of responses.slice(0, 3)) {
    assert.notEqual(response.status, 429);
  }

  assert.equal(responses[3].status, 429);
  assert.ok(Number(responses[3].headers["retry-after"]) >= 1);
  assert.equal(responses[3].body.success, false);
  assert.ok(responses[3].body.retryAfterSeconds >= 1);
});

test("2. محدودیت بین مسیرهای مختلف مشترک است", async () => {
  await IpTracker.deleteMany({});

  const first = await request(app).get("/Products");
  const second = await request(app).get("/Products");
  const third = await request(app).get("/Admin");
  const fourth = await request(app).get("/Admin");

  assert.notEqual(first.status, 429);
  assert.notEqual(second.status, 429);
  assert.notEqual(third.status, 429);
  assert.equal(fourth.status, 429);
});

test("3. دو IP متفاوت باید شمارنده مستقل داشته باشند", async () => {
  await IpTracker.deleteMany({});

  const ipA = uniqueIp();
  const ipB = uniqueIp();

  for (let i = 0; i < 3; i++) {
    const result = await trackerService(ipA);
    assert.equal(result.allowed, true);
  }

  const blockedA = await trackerService(ipA);
  const allowedB = await trackerService(ipB);

  assert.equal(blockedA.allowed, false);
  assert.equal(allowedB.allowed, true);
});

test("4. درخواست پس از پایان بلاک دوباره مجاز می‌شود", async () => {
  await IpTracker.deleteMany({});

  const ip = uniqueIp();

  for (let i = 0; i < 4; i++) {
    await trackerService(ip);
  }

  const blocked = await trackerService(ip);
  assert.equal(blocked.allowed, false);

  await sleep(300);

  const afterBlock = await trackerService(ip);
  assert.equal(afterBlock.allowed, true);
});

test("5. پنجره زمانی منقضی‌شده شمارنده را ریست می‌کند", async () => {
  await IpTracker.deleteMany({});

  const ip = uniqueIp();

  const first = await trackerService(ip);
  assert.equal(first.allowed, true);

  await sleep(600);

  const afterWindow = await trackerService(ip);

  assert.equal(afterWindow.allowed, true);
  assert.equal(afterWindow.tracker.RequestCount, 1);
});

test("6. درخواست‌های هم‌زمان نباید از سقف مجاز عبور کنند", async () => {
  await IpTracker.deleteMany({});

  const ip = uniqueIp();
  const totalRequests = 30;

  const results = await Promise.all(
    Array.from(
      { length: totalRequests },
      () => trackerService(ip)
    )
  );

  const allowedCount = results.filter(
    (result) => result.allowed
  ).length;

  const blockedCount = results.filter(
    (result) => !result.allowed
  ).length;

  assert.equal(allowedCount, 3);
  assert.equal(blockedCount, totalRequests - 3);

  const stored = await IpTracker.findOne({ UserIp: ip });

  assert.ok(stored);
  assert.equal(stored.isBlocked, true);
});

test("7. IPهای مستقل در درخواست‌های هم‌زمان هم مستقل می‌مانند", async () => {
  await IpTracker.deleteMany({});

  const ipA = uniqueIp();
  const ipB = uniqueIp();

  const results = await Promise.all([
    ...Array.from({ length: 10 }, () => trackerService(ipA)),
    ...Array.from({ length: 10 }, () => trackerService(ipB)),
  ]);

  const resultsA = results.slice(0, 10);
  const resultsB = results.slice(10);

  assert.equal(
    resultsA.filter((result) => result.allowed).length,
    3
  );

  assert.equal(
    resultsB.filter((result) => result.allowed).length,
    3
  );
});
