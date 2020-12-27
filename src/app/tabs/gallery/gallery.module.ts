import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GalleryPageRoutingModule } from './gallery-routing.module';

import { PieceFilterPipe } from '../../pipes/FilterPipe';

import { GalleryPage } from './gallery.page';
import { PieceCardComponent } from './piece-card/piece-card.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,        
    GalleryPageRoutingModule
  ],
  declarations: [
    PieceFilterPipe,
    GalleryPage,
    PieceCardComponent
  ],
  entryComponents: [
    PieceCardComponent,
  ]
})
export class GalleryPageModule {}
