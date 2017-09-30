import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsPage } from './directions';

@NgModule({
  declarations: [
    DirectionsPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionsPage),
  ],
})
export class DirectionsPageModule {}
