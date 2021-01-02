import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { PieceCategory } from '../../shared/services/backend/model/models';
import { PieceCategoryControllerService } from '../../shared/services/backend/api/api';

@Component({
  selector: 'tab-category',
  templateUrl: 'category.page.html',
  styleUrls: ['category.page.scss']
})
export class CategoryPage {
  public pieceCategories: PieceCategory[];

  constructor(public router: Router,
              public pieceCategoryControllerService: PieceCategoryControllerService) {
      this.loadCategories();
  }

  private loadCategories() {
    this.pieceCategoryControllerService.pieceCategoryControllerFind()
      .subscribe((pieceCategories: any) => {
        this.pieceCategories = pieceCategories;
    },
    err => {
      console.log(err);
    });
  }

  public onShowCategory(event) {
    this.router.navigate(['tabs/category/sub-category']);
  }
}
