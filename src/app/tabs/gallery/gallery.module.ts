import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryPageRoutingModule } from './gallery-routing.module';

import { PiecePageModule } from '../piece/piece.module';
import { GalleryPage } from './gallery.page';
import { PieceCardComponent } from './piece-card/piece-card.component';

import { PieceFilterPipe } from '../../pipes/FilterPipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GalleryPageRoutingModule,
    PiecePageModule
  ],
  declarations: [
    PieceFilterPipe,
    GalleryPage,
    PieceCardComponent,
  ],
  entryComponents: [
    PieceCardComponent,
  ],
  exports: [
    PieceCardComponent
  ]
})
export class GalleryPageModule {}
