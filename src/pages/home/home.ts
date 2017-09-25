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

  constructor(public navCtrl: NavController) {

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
