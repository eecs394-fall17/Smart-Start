import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DirectionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-directions',
  templateUrl: 'directions.html',
})
export class DirectionsPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
    map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsPage');
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
            origin: 'Northwestern University',
            destination: 'Merchandise Mart Chicago',
            travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {

            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res);
            } else {
                console.warn(status);
            }

        });

    }
}
