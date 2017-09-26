import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

import { Platform } from 'ionic-angular';

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

	homePage = HomePage;
	alarmTime: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.alarmTime = this.navParams.get('alarm');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmDisplayPage');
  }



}
