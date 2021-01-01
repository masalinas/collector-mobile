import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { PiecePage } from './piece.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { PiecePageRoutingModule } from './piece-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    PiecePageRoutingModule
  ],
  declarations: [PiecePage],
  exports: [PiecePage]
})
export class PiecePageModule {}
