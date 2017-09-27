import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlarmDisplayPage } from './alarm-display';

@NgModule({
  declarations: [
    AlarmDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(AlarmDisplayPage),
  ],
})
export class AlarmDisplayPageModule {}
