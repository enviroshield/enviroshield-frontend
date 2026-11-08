export interface INotificationPreferences {
  // Email preferences
  emailOrders: boolean;
  emailBookings: boolean;
  emailInquiries: boolean;
  emailInventory: boolean;
  emailSecurity: boolean;
  emailMarketing: boolean;

  // In-app & browser preferences
  inAppOrders: boolean;
  inAppBookings: boolean;
  inAppInquiries: boolean;
  inAppInventory: boolean;
  soundEnabled: boolean;
  browserPush: boolean;
}

export const defaultNotificationPreferences: INotificationPreferences = {
  emailOrders: true,
  emailBookings: true,
  emailInquiries: true,
  emailInventory: true,
  emailSecurity: true,
  emailMarketing: false,

  inAppOrders: true,
  inAppBookings: true,
  inAppInquiries: true,
  inAppInventory: true,
  soundEnabled: true,
  browserPush: false,
};
