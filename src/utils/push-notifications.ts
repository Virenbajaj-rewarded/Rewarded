import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export const requestUserPermission = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
};

const getFcmToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  //   await registerFCM(token)

  messaging().onTokenRefresh(token => {
    //call api and pass the token
    // refreshFCM(token);
  });
  // Send this token to your backend server to target specific users
};

export const displayForegroundNotification = async () => {
  const channelId = 'Rewarded-dev';
  const channelName = 'Rewarded';

  notifee.isChannelCreated(channelId).then(isCreated => {
    if (!isCreated) {
      notifee.createChannel({
        id: channelId,
        name: channelName,
        sound: 'default',
      });
    }
  });

  messaging().onMessage(async remoteMessage => {
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  });
};

const handleBackgroundMessage = async () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    await notifee.incrementBadgeCount();
  });
};

export const resetBadgeCount = async () => {
  await notifee.setBadgeCount(0);
};

export const setNotificationsHandler = async () => {
  await requestUserPermission();
  await displayForegroundNotification();
  await handleBackgroundMessage();
};
