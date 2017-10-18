import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  departureAddress: string;
  arrivalAddress: string;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  autoInput: boolean;

  // Edit or Add
  purpose: string;

  // alarm vars
  readyTime: number;
  arrivalTime: Date;
  arrivalTimeString: string;
  departureTime: Date;
  tripDuration: number;
  alarmTime: Date;
  alarmId: number;

  //autocomplete
  acOrigins: any;
  acDestinations: any;
  acService: any;

  constructor(
    public viewController: ViewController,
    public platform: Platform,
    public navCtrl: NavController,
    private localNotifications: LocalNotifications,
    params: NavParams
  ) {
    // timezone conversion
    this.platform.ready().then((readysource) => {
      this.purpose = params.get('purpose');

      this.arrivalTime = new Date();
      this.departureTime = new Date();
      this.arrivalTimeString = new Date(this.arrivalTime.getTime() - this.arrivalTime.getTimezoneOffset() * 60000).toISOString();

      this.autoInput = true;
      if (this.autoInput) {
        this.arrivalAddress = '222 W Merchandise Mart Plaza';
        this.departureAddress = '2025 Maple Ave';
        this.readyTime = 20;
        this.alarmId = Date.now();
      }

      if (this.purpose == 'Edit') {
        this.arrivalAddress = params.get('destination');
        this.departureAddress = params.get('departureAddress');
        this.readyTime = params.get('readyTime');
        this.arrivalTime = params.get('arrivalTime');
        this.arrivalTimeString = new Date(this.arrivalTime.getTime() - this.arrivalTime.getTimezoneOffset() * 60000).toISOString();
      }

      this.acService = new google.maps.places.AutocompleteService();
      this.acOrigins = [];
      this.acDestinations = [];
    });
  }

  SetAlarm(time: Date) {
    this.localNotifications.schedule({
      id: this.alarmId,
      text: 'Time to wake up',
      at: time,
      sound: null
    });
    this.alarmTime = time;
  }

  CalculateRoute() {
    this.directionsService.route({
      origin: this.departureAddress,
      destination: this.arrivalAddress,
      travelMode: 'TRANSIT',
      transitOptions: {
        arrivalTime: this.arrivalTime
      }
    }, (response, status) => {
      if (status === 'OK') {
        this.tripDuration = response.routes[0].legs[0].duration.value * 1000;
        this.departureTime = new Date(this.arrivalTime.getTime() - this.tripDuration - this.readyTime * 60000);
        this.departureTime.setSeconds(0);

        // alarm pushed up by 24 hours if calculated departure time already happened
        if (this.departureTime < new Date()) {
          this.departureTime = new Date(this.departureTime.getTime() + 24 * 60 * 60 * 1000);
          this.arrivalTime = new Date(this.arrivalTime.getTime() + 24 * 60 * 60 * 1000);
        }

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
        alarmId: this.alarmId,
        alarmTime: this.alarmTime,
        departureTime: this.departureTime,
        arrivalTime: this.arrivalTime,
        tripDuration: this.tripDuration,
        destination: this.arrivalAddress,
        departureAddress: this.departureAddress,
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

  updateOrigin() {
    console.log("on change")
    if (this.departureAddress == '') {
      this.acOrigins = [];
      return;
    }
    let self = this;
    let config = {
      types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.departureAddress,
      componentRestrictions: { country: 'US' }
    }
    this.acService.getPlacePredictions(config, function(predictions, status) {
      console.log('prediction status: ', status);
      if (predictions == null || (predictions.length == 1 && predictions[0].description == self.departureAddress)) return;

      self.acOrigins = [];
      predictions.forEach(function(prediction) {
        self.acOrigins.push(prediction);
      });
      console.log(self.acOrigins);
    });
  }

  selectOrigin(item) {
    this.departureAddress = item.description;
    this.acOrigins = [];
  }

  updateDestination() {
    if (this.arrivalAddress == '') {
      this.acDestinations = [];
      return;
    }
    let self = this;
    let config = {
      types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.arrivalAddress,
      componentRestrictions: { country: 'US' }
    }
    this.acService.getPlacePredictions(config, function(predictions, status) {
      console.log('prediction status: ', status);
      if (predictions == null || (predictions.length == 1 && predictions[0].description == self.arrivalAddress)) return;

      self.acDestinations = [];
      predictions.forEach(function(prediction) {
        self.acDestinations.push(prediction);
      });
    });
  }

  selectDestination(item) {
    this.arrivalAddress = item.description;
    this.acDestinations = [];
  }

}
