import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { STRINGS } from '../i18n/strings';
import { computePrayerTimes, PrayerKey } from '../utils/prayerTimes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ALERT_PRAYERS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NOTIF_PREFIX = 'prayer-alert-';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-alerts', {
        name: 'Prayer Time Alerts',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    return status === 'granted';
  } catch {
    return false;
  }
}

async function cancelPrayerNotifications(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => n.identifier.startsWith(NOTIF_PREFIX))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  } catch {
    // ignore
  }
}

export async function scheduleUpcomingPrayerNotifications(
  lat: number,
  lng: number,
  index: 0 | 1 | 2
): Promise<void> {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    await cancelPrayerNotifications();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const days = [computePrayerTimes(lat, lng, now), computePrayerTimes(lat, lng, tomorrow)];
    const title = STRINGS.prayerAlertTitle[index];

    for (const dayTimes of days) {
      for (const entry of dayTimes) {
        if (!ALERT_PRAYERS.includes(entry.key)) continue;
        if (entry.time.getTime() <= Date.now()) continue;
        const name = STRINGS[entry.key][index];
        await Notifications.scheduleNotificationAsync({
          identifier: `${NOTIF_PREFIX}${entry.key}-${entry.time.getTime()}`,
          content: {
            title,
            body: name,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: entry.time,
          },
        });
      }
    }
  } catch {
    // scheduling is best-effort; never crash the app over it
  }
}
