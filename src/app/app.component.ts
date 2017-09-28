import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AlarmDisplayPage } from '../pages/alarm-display/alarm-display';

import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = AlarmDisplayPage;
  alarmFile: MediaObject;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private media: Media,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('android')) {
        this.alarmFile = this.media.create('file:///android_asset/www/sounds/alarm.mp3');
      } else if (platform.is('ios')) {
        this.alarmFile = this.media.create('/var/mobile/Applications/<UUID>/alarm.mp3');
      }

      this.localNotifications.on('trigger', () => this.alarmFile.play());
      this.localNotifications.on('clear', () => this.alarmFile.stop());

      this.backgroundMode.enable();
    });
  }
}
