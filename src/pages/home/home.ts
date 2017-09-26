import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Media, MediaObject } from '@ionic-native/media';

declare var google;


@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start = 'chicago, il';
  end = 'chicago, il';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  // alarm vars
  arrivalTime: string;
  departureTime: string;
  alarmFile: MediaObject;

  constructor(public platform: Platform, public navCtrl: NavController, private localNotifications: LocalNotifications, private media: Media) {
    // timezone conversion
    this.departureTime = (new Date(new Date().getTime() - new Date().getTimezoneOffset()*60000)).toISOString();
    this.platform.ready().then((readysource) => {
      if (this.platform.is('android')) {
        this.alarmFile = this.media.create('file:///android_asset/www/sounds/alarm.mp3');
      } else if (this.platform.is('ios')) {
        this.alarmFile = this.media.create('/var/mobile/Applications/<UUID>/alarm.mp3');
      }

      this.localNotifications.on('trigger', () => this.alarmFile.play());
      this.localNotifications.on('clear', () => this.alarmFile.stop());
    });
  }

  SetAlarm(time: Date) {
    // timezone conversion
    var alarmTime = new Date(time);
    alarmTime.setHours(alarmTime.getHours() + alarmTime.getTimezoneOffset() / 60);
    alarmTime.setSeconds(0);

    this.localNotifications.schedule({
      id: 0,
      text: 'Time to wake up',
      at: alarmTime,
      sound: null
    });

    console.log("Alarm set at ", alarmTime.toString());
  }

  ionViewDidLoad(){
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });

    this.directionsDisplay.setMap(this.map);
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
