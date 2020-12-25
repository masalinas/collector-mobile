import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiecePage } from './piece.page';

const routes: Routes = [
  {
    path: '',
    component: PiecePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiecePageRoutingModule {}
