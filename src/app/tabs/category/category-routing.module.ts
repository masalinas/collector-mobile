import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryPage } from './category.page';
import { SubCategoryPage } from './subcategory/subcategory.page';
import { GalleryPage } from '../gallery/gallery.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage,
  },
  {
    path: 'sub-category',
    component: SubCategoryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryPageRoutingModule {}
