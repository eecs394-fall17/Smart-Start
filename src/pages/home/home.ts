// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { NavController } from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';
//
// declare var google;
//
// @Component({
//   selector: 'home-page',
//   templateUrl: 'home.html'
// })
// export class HomePage {
//
//   @ViewChild('map') mapElement: ElementRef;
//   map: any;
//
//   constructor(public navCtrl: NavController, public geolocation: Geolocation) {
//
//   }
//
//   ionViewDidLoad(){
//     this.loadMap();
//   }
//
//   loadMap(){
//
//     this.geolocation.getCurrentPosition().then((position) => {
//
//       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//
//       let mapOptions = {
//         center: latLng,
//         zoom: 15,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       }
//
//       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
//
//     }, (err) => {
//       console.log(err);
//     });
//
//   }
//
// }

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
  date: Date;
  myTime: string;
  alarms: Array<{id: number, note: string, time: string}>;
  alarmFile: MediaObject;

  constructor(public platform: Platform, public navCtrl: NavController, private localNotifications: LocalNotifications, private media: Media) {
    this.date = new Date();
    this.myTime = (new Date(this.date.getTime() - this.date.getTimezoneOffset()*60000)).toISOString();
    this.alarms = [];
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

  SetAlarm() {
    // temp fix with android only path
    // const alarmFile: MediaObject = this.media.create('file:///android_asset/www/sounds/alarm.mp3');

    var alarmTime = new Date(this.myTime);
    alarmTime.setHours(alarmTime.getHours() + alarmTime.getTimezoneOffset() / 60);
    alarmTime.setSeconds(0);
    console.log(this.alarms.length, alarmTime);

    this.localNotifications.schedule({
      id: this.alarms.length,
      text: 'Time to wake up',
      at: alarmTime,
      sound: null
    });

    this.alarms.push({
      id: this.alarms.length,
      note: 'Alarm ' + this.alarms.length,
      time: this.myTime
    });
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
