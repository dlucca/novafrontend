import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "@/lib/meta";

export const runtime = "nodejs";

type IncomingEvent = {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  user_data?: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    external_id?: string;
    ct?: string;
    st?: string;
    zp?: string;
    country?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: Record<string, unknown>;
};

const sha256 = (s: string) =>
  createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

const normPhone = (s: string) => s.replace(/[^\d]/g, "");

export async function POST(req: NextRequest) {
  const PIXEL_ID = process.env.META_PIXEL_ID || META_PIXEL_ID;
  const TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
  const TEST_CODE = process.env.META_TEST_EVENT_CODE;

  if (!PIXEL_ID || !TOKEN) {
    return NextResponse.json({ ok: false, error: "Meta CAPI not configured" }, { status: 500 });
  }

  let body: IncomingEvent;
  try {
    body = (await req.json()) as IncomingEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.event_name || !body?.event_id) {
    return NextResponse.json({ ok: false, error: "event_name and event_id required" }, { status: 400 });
  }

  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || undefined;
  const ua = req.headers.get("user-agent") ?? undefined;

  const u = body.user_data ?? {};
  const user_data: Record<string, string | string[]> = {};
  if (u.em) user_data.em = sha256(u.em);
  if (u.ph) user_data.ph = sha256(normPhone(u.ph));
  if (u.fn) user_data.fn = sha256(u.fn);
  if (u.ln) user_data.ln = sha256(u.ln);
  if (u.external_id) user_data.external_id = sha256(u.external_id);
  if (u.ct) user_data.ct = sha256(u.ct);
  if (u.st) user_data.st = sha256(u.st);
  if (u.zp) user_data.zp = sha256(u.zp);
  if (u.country) user_data.country = sha256(u.country);
  if (u.fbp) user_data.fbp = u.fbp;
  if (u.fbc) user_data.fbc = u.fbc;
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        action_source: "website" as const,
        event_source_url: body.event_source_url,
        user_data,
        custom_data: body.custom_data ?? {},
      },
    ],
    ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}),
  };

  const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error("[Meta CAPI] error", res.status, json);
      return NextResponse.json({ ok: false, status: res.status, error: json }, { status: 502 });
    }
    return NextResponse.json({ ok: true, fb: json });
  } catch (err) {
    console.error("[Meta CAPI] fetch failed", err);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 502 });
  }
}
