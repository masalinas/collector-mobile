import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CategoryPageRoutingModule } from './category-routing.module';

import { IonicModule } from '@ionic/angular';

import { CategoryPage } from './category.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CategoryPage }]),
    CategoryPageRoutingModule,
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
