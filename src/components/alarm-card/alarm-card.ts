import { Component, Input, Output } from '@angular/core';

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

  alarmExpand: boolean;

  toggleAlarm = function() {
  	this.alarmExpand = !this.alarmExpand;
  	console.log(this.alarmExpand);
  };
  
  isAlarmExpanded = function() {
    return this.alarmExpand;
  };

  constructor() {
  	this.alarmExpand = false;
  	// this.departureTime = departureTime;
  	// this.arrivalTime = arrivalTime;
  	// this.destination = destination;
  	// this.tripDurationString = tripDurationString;
  	// this.readyTimeString = readyTimeString;
  }

}
