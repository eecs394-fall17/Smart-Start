import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  departureAddress: string;
  arrivalAddress: string;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  autoInput: boolean;

  // alarm vars
  readyTime: number;
  arrivalTime: Date;
  arrivalTimeString: string;
  departureTime: Date;
  tripDuration: number;

  constructor(
    public viewController: ViewController,
    public platform: Platform,
    public navCtrl: NavController,
    private localNotifications: LocalNotifications
  ) {
    // timezone conversion
    this.platform.ready().then((readysource) => {
      this.arrivalTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
      this.departureTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
      this.arrivalTimeString = this.arrivalTime.toISOString();

      this.autoInput = true;
      if (this.autoInput) {
        this.arrivalAddress = '222 W Merchandise Mart Plaza';
        this.departureAddress = '2025 Maple Ave';
        this.readyTime = 20;
      }
    });
  }

  SetAlarm(time: Date) {
    this.localNotifications.schedule({
      id: 0,
      text: 'Time to wake up',
      at: time,
      sound: null
    });

    console.log("Alarm set at ", time.toString());
  }

  CalculateRoute() {
    this.directionsService.route({
      origin: this.departureAddress,
      destination: this.arrivalAddress,
      travelMode: 'TRANSIT',
      transitOptions: {
        arrivalTime: new Date(this.arrivalTimeString)
      }
    }, (response, status) => {
      if (status === 'OK') {
        this.tripDuration = response.routes[0].legs[0].duration.value * 1000;
        this.departureTime = new Date(this.arrivalTime.getTime() - this.tripDuration - this.readyTime * 60000);
        this.departureTime.setSeconds(0);

        this.SetAlarm(this.departureTime);
        this.DismissModal(true);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  DismissModal(passData: boolean) {
    if (passData) {
      let data = {
        alarmId: 0,
        departureTime: new Date(this.departureTime.getTime()+ new Date().getTimezoneOffset() * 60000),
        arrivalTime: new Date(new Date(this.arrivalTimeString).getTime() + new Date().getTimezoneOffset() * 60000),
        tripDuration: this.tripDuration,
        destination: this.arrivalAddress,
        readyTime: this.readyTime
      }
      this.viewController.dismiss(data);
    } else {
      this.viewController.dismiss();
    }
  }

  arrivalTimeChange() {
    this.arrivalTime = new Date(new Date(this.arrivalTimeString).getTime() + new Date().getTimezoneOffset() * 60000);
    this.arrivalTime.setSeconds(0);
  }

}
