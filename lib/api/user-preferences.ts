import {
  defaultNotificationPreferences,
  INotificationPreferences,
} from "@/types/user-preferences.type";

export async function fetchNotificationPreferences(): Promise<INotificationPreferences> {
  const response = await fetch("/api/user/notification-preferences", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load notification preferences.");
  }

  const json = await response.json();
  return json.data || defaultNotificationPreferences;
}

export async function updateNotificationPreferences(
  preferences: Partial<INotificationPreferences>,
): Promise<INotificationPreferences> {
  const response = await fetch("/api/user/notification-preferences", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || "Failed to update notification preferences.",
    );
  }

  const json = await response.json();
  return json.data;
}
