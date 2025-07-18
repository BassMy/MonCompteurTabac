import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  async scheduleNextCigaretteNotification(delayInMinutes: number): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚬 Cigarette autorisée',
          body: 'Vous pouvez maintenant fumer votre prochaine cigarette si vous le souhaitez.',
          sound: true,
        },
        trigger: {
          seconds: delayInMinutes * 60,
        },
      });
    } catch (error) {
      console.error('Erreur notification:', error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur annulation notifications:', error);
    }
  },
};