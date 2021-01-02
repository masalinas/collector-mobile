import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { PieceSubCategory } from '../../../shared/services/backend/model/models';
import { PieceSubCategoryControllerService } from '../../../shared/services/backend/api/api';

@Component({
  selector: 'view-subcategory',
  templateUrl: 'subcategory.page.html',
  styleUrls: ['subcategory.page.scss']
})
export class SubCategoryPage implements OnInit {
  public pieceSubCategories: PieceSubCategory[];

  constructor(public router: Router,
              public pieceSubCategoryControllerService: PieceSubCategoryControllerService) {
  }

  ngOnInit(): void {
    this.loadSubCategories();
  }

  private loadSubCategories() {
    this.pieceSubCategoryControllerService.pieceSubCategoryControllerFind()
      .subscribe((pieceSubCategories: any) => {
        this.pieceSubCategories = pieceSubCategories;
    },
    err => {
      console.log(err);
    });
  }
}
