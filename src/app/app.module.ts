import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AlarmDisplayPage } from '../pages/alarm-display/alarm-display';
import { DirectionsPage } from '../pages/directions/directions';

import { AlarmCardComponent } from '../components/alarm-card/alarm-card';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Media } from '@ionic-native/media';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AlarmDisplayPage,
    DirectionsPage,
    AlarmCardComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
        scrollAssist: false,
        autoFocusAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AlarmDisplayPage,
    DirectionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    BackgroundMode,
    Media,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
