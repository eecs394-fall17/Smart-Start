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

  PresentAddAlarmModal() {
    console.log(this.alarms);
    if (this.alarms.length > 0) {
      console.log(this.alarms[0].display);
    }

    let modal = this.modalController.create(HomePage, {
      purpose: 'Add'
    });

    modal.onDidDismiss(data => {
      if (data != null) {
        let alarm = new AlarmCardComponent(this.modalController, this.navCtrl, this.navParams);
        alarm.alarmId = data.alarmId;
        alarm.departureTime = data.departureTime;
        alarm.arrivalTime = data.arrivalTime;
        alarm.destination = data.destination;
        alarm.readyTime = data.readyTime;
        alarm.tripDurationString = this.DurationToString(data.tripDuration)
        alarm.readyTimeString = this.DurationToString(data.readyTime * 60000);
        alarm.alarmTime = data.alarmTime;
        alarm.departureAddress = data.departureAddress;
        alarm.display = true;
        this.alarms.push(alarm);
      }
    });
    modal.present()
  }

  DurationToString(time: number) {
    var result = '';
    time = Math.floor(time / 60000);
    if (time < 60) {
      result = time.toString() + " minutes";
    } else {
      result = (Math.floor(time / 60)).toString() + " hours and " + (time % 60).toString() + " minutes";
    }
    return result
  }

  RemoveAlarm(alarmId) {
    for (var i = 0; i < this.alarms.length; i++) {
      if (this.alarms[i].alarmId == alarmId) {
        this.alarms.splice(i, 1);
        break;
      }
    }
  }

}
