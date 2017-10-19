import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

import { Platform } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AlarmCardComponent } from '../../components/alarm-card/alarm-card';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Media, MediaObject } from '@ionic-native/media';

/**
 * Generated class for the AlarmDisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alarm-display',
  templateUrl: 'alarm-display.html',
})
export class AlarmDisplayPage {

  alarms: Array<AlarmCardComponent>;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    public modalController: ModalController
  ) {
    this.alarms = new Array();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AlarmDisplayPage');
  // }

  PresentAddAlarmModal() {
    let modal = this.modalController.create(HomePage);

    modal.onDidDismiss(data => {
      if (data != null) {
      	let alarm = new AlarmCardComponent();
      	alarm.departureTime = data.departureTime;
      	alarm.arrivalTime = data.arrivalTime;
        alarm.destination = data.destination;
        alarm.tripDurationString = this.DurationToString(data.tripDuration)
        alarm.readyTimeString = this.DurationToString(data.readyTime * 60000);
        alarm.alarmTime = data.alarmTime;
        alarm.alarmsArray = this.alarms;
        alarm.arraySize = this.arraySize;
        this.alarms.push(alarm);
      }
    });
    modal.present()
    console.log(this.alarms);
  }

  DurationToString(time: number) {
    var result = '';
    console.log(time);
    time = Math.floor(time / 60000);
    console.log(time);
    if (time < 60) {
      result = time.toString() + " minutes";
    } else {
      result = (Math.floor(time / 60)).toString() + " hours and " + (time % 60).toString() + " minutes";
    }
    return result
  }

  arraySize(){
    return this.alarms.length;
  }

}
