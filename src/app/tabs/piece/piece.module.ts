import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PiecePageRoutingModule } from './piece-routing.module';

import { IonicModule } from '@ionic/angular';

import { PiecePage } from './piece.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PiecePageRoutingModule
  ],
  declarations: [PiecePage],
  exports: [PiecePage]
})
export class PiecePageModule {}
