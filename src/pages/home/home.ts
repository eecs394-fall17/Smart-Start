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

  //Map
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  departureAddress: string;
  arrivalAddress: string;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  // alarm vars
  arrivalTime: string;
  departureTime: string;
  alarmFile: MediaObject;

  constructor(public platform: Platform, public navCtrl: NavController, private localNotifications: LocalNotifications, private media: Media) {
    // timezone conversion
    this.platform.ready().then((readysource) => {
      if (this.platform.is('android')) {
        this.alarmFile = this.media.create('file:///android_asset/www/sounds/alarm.mp3');
      } else if (this.platform.is('ios')) {
        this.alarmFile = this.media.create('/var/mobile/Applications/<UUID>/alarm.mp3');
      }

      this.arrivalTime = (new Date(new Date().getTime() - new Date().getTimezoneOffset()*60000)).toISOString();
      this.departureTime = (new Date(new Date().getTime() - new Date().getTimezoneOffset()*60000)).toISOString();

      this.localNotifications.on('trigger', () => this.alarmFile.play());
      this.localNotifications.on('clear', () => this.alarmFile.stop());
    });
  }

  //Map
  ionViewDidLoad(){

        this.loadMap();
        this.startNavigating();

    }

    loadMap(){

          let latLng = new google.maps.LatLng(-34.9290, 138.6010);

          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }

          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      }

      startNavigating(){

          let directionsService = new google.maps.DirectionsService;
          let directionsDisplay = new google.maps.DirectionsRenderer;

          directionsDisplay.setMap(this.map);
          directionsDisplay.setPanel(this.directionsPanel.nativeElement);

          directionsService.route({
              origin: 'adelaide',
              destination: 'adelaide oval',
              travelMode: google.maps.TravelMode['DRIVING']
          }, (res, status) => {

              if(status == google.maps.DirectionsStatus.OK){
                  directionsDisplay.setDirections(res);
              } else {
                  console.warn(status);
              }

          });

      }

  ConvertTimeZone(time: Date) {
    var resultTime = new Date(time);
    resultTime.setHours(resultTime.getHours() + resultTime.getTimezoneOffset() / 60);
    resultTime.setSeconds(0);
    return resultTime;
  }

  SetAlarm(time: Date) {
    var alarmTime = this.ConvertTimeZone(time);

    this.localNotifications.schedule({
      id: 0,
      text: 'Time to wake up',
      at: alarmTime,
      sound: null
    });

    console.log("Alarm set at ", alarmTime.toString());
  }

  CalculateRoute() {
    this.directionsService.route({
      origin: this.departureAddress,
      destination: this.arrivalAddress,
      travelMode: 'TRANSIT',
      transitOptions: {
        arrivalTime: this.ConvertTimeZone(new Date(this.arrivalTime))
      }
    }, (response, status) => {
      if (status === 'OK') {
        console.log(response);
        var duration = response.routes[0].legs[0].duration.value * 1000;
        this.departureTime = new Date(new Date(this.arrivalTime).getTime() - duration).toISOString();
        this.SetAlarm(new Date(this.departureTime));
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
