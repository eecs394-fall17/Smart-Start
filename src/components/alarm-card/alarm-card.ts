import { Component, Input, Output } from '@angular/core';
import { HomePage } from '../../pages/home/home';
import { AlarmDisplayPage } from '../../pages/alarm-display/alarm-display';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the AlarmCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'alarm-card',
  templateUrl: 'alarm-card.html'
})
export class AlarmCardComponent {

  @Input('alarmTime') alarmTime: Date;
  @Input('departureTime') departureTime: Date;
  @Input('arrivalTime') arrivalTime: Date;
  @Input('destination') destination: string;
  @Input('tripDurationString') tripDurationString: string;
  @Input('readyTimeString') readyTimeString: string;

  // not displayed
  @Input('alarmId') alarmId: number;
  @Input('readyTime') readyTime: number;
  @Input('departureAddress') departureAddress: string;

  alarmExpand: boolean;

  toggleAlarm = function() {
    this.alarmExpand = !this.alarmExpand;
    console.log(this.alarmExpand);
  };

  isAlarmExpanded = function() {
    return this.alarmExpand;
  };

  constructor(
    public modalController: ModalController
  ) {
    this.alarmExpand = false;
  }

  PresentEditAlarmModal() {
    console.log(this.departureAddress, this.readyTime);
    let modal = this.modalController.create(HomePage, {
      purpose: 'Edit',
      arrivalTime: this.arrivalTime,
      destination: this.destination,
      departureAddress: this.departureAddress,
      readyTime: this.readyTime
    });

    modal.onDidDismiss(data => {
      if (data != null) {
        this.departureTime = data.departureTime;
        this.arrivalTime = data.arrivalTime;
        this.destination = data.destination;
        this.tripDurationString = this.DurationToString(data.tripDuration)
        this.readyTimeString = this.DurationToString(data.readyTime * 60000);
        this.readyTime = data.readyTime;
        this.alarmTime = data.alarmTime;
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

}
