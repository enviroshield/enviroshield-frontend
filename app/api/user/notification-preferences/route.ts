import { NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth-guards";
import clientPromise from "@/lib/mongodb";
import {
  defaultNotificationPreferences,
  INotificationPreferences,
} from "@/types/user-preferences.type";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("user_notification_preferences");

    const record = await collection.findOne({ userId: session.user.id });

    const preferences: INotificationPreferences = {
      ...defaultNotificationPreferences,
      ...(record?.preferences || {}),
    };

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Failed to get notification preferences:", error);
    return NextResponse.json(
      { error: "Unable to retrieve notification preferences." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid payload provided." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("user_notification_preferences");

    const existingRecord = await collection.findOne({
      userId: session.user.id,
    });
    const currentPreferences: INotificationPreferences = {
      ...defaultNotificationPreferences,
      ...(existingRecord?.preferences || {}),
    };

    // Whitelist known fields
    const updatedPreferences: INotificationPreferences = {
      emailOrders:
        typeof body.emailOrders === "boolean"
          ? body.emailOrders
          : currentPreferences.emailOrders,
      emailBookings:
        typeof body.emailBookings === "boolean"
          ? body.emailBookings
          : currentPreferences.emailBookings,
      emailInquiries:
        typeof body.emailInquiries === "boolean"
          ? body.emailInquiries
          : currentPreferences.emailInquiries,
      emailInventory:
        typeof body.emailInventory === "boolean"
          ? body.emailInventory
          : currentPreferences.emailInventory,
      emailSecurity:
        typeof body.emailSecurity === "boolean"
          ? body.emailSecurity
          : currentPreferences.emailSecurity,
      emailMarketing:
        typeof body.emailMarketing === "boolean"
          ? body.emailMarketing
          : currentPreferences.emailMarketing,

      inAppOrders:
        typeof body.inAppOrders === "boolean"
          ? body.inAppOrders
          : currentPreferences.inAppOrders,
      inAppBookings:
        typeof body.inAppBookings === "boolean"
          ? body.inAppBookings
          : currentPreferences.inAppBookings,
      inAppInquiries:
        typeof body.inAppInquiries === "boolean"
          ? body.inAppInquiries
          : currentPreferences.inAppInquiries,
      inAppInventory:
        typeof body.inAppInventory === "boolean"
          ? body.inAppInventory
          : currentPreferences.inAppInventory,
      soundEnabled:
        typeof body.soundEnabled === "boolean"
          ? body.soundEnabled
          : currentPreferences.soundEnabled,
      browserPush:
        typeof body.browserPush === "boolean"
          ? body.browserPush
          : currentPreferences.browserPush,
    };

    await collection.updateOne(
      { userId: session.user.id },
      {
        $set: {
          userId: session.user.id,
          preferences: updatedPreferences,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully.",
      data: updatedPreferences,
    });
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    return NextResponse.json(
      { error: "Unable to update notification preferences." },
      { status: 500 },
    );
  }
}
