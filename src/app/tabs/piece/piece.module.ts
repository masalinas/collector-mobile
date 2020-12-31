import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PiecePage } from './piece.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { PiecePageRoutingModule } from './piece-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PiecePageRoutingModule
  ],
  declarations: [PiecePage],
  exports: [PiecePage]
})
export class PiecePageModule {}
