import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CategoryPageRoutingModule } from './category-routing.module';

import { IonicModule } from '@ionic/angular';

import { GalleryPageModule } from '../gallery/gallery.module';

import { CategoryPage } from './category.page';
import { SubCategoryPage } from './subcategory/subcategory.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CategoryPage }]),
    CategoryPageRoutingModule,
    GalleryPageModule,
  ],
  declarations: [
    CategoryPage,
    SubCategoryPage
  ]
})
export class CategoryPageModule {}
