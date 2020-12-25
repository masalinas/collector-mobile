import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { Photo, PhotoService } from '../../services/photo.service';

import { PieceFamily, PieceCategory, PieceSubCategory, Piece } from '../../shared/services/backend/model/models';
import { PieceFamilyControllerService,
         PieceCategoryControllerService,
         PieceSubCategoryControllerService,
         PieceControllerService } from '../../shared/services/backend/api/api';

@Component({
  selector: 'app-piece',
  templateUrl: 'piece.page.html',
  styleUrls: ['piece.page.scss']
})
export class PiecePage implements OnInit {
  public pieceFamilySelected: PieceFamily;
  public pieceCategorySelected: PieceCategory;
  public pieceSubCategorySelected: PieceSubCategory;
  public pieceNameSelected: string;

  private pieceFamilies: PieceFamily[];
  private pieceCategories: PieceCategory[];
  private pieceSubCategories: PieceSubCategory[];

  constructor(public actionSheetController: ActionSheetController,
              public pieceFamilyControllerService: PieceFamilyControllerService,
              public pieceCategoryControllerService: PieceCategoryControllerService,
              public pieceSubCategoryControllerService: PieceSubCategoryControllerService,
              public pieceControllerService: PieceControllerService,
              public photoService: PhotoService) { }

  async ngOnInit() {
    this.getFamilies();

    // load images from storage
    await this.photoService.loadSaved();
  }

  private getFamilies() {
    this.pieceFamilyControllerService.pieceFamilyControllerFind()
      .subscribe((pieceFamilies: any) => {
        this.pieceFamilies = pieceFamilies;
    },
    err => {
      console.log(err);
    });
  }

  private getCategoriesByFamily() {
    let filter: any = {filter: JSON.stringify({where: {pieceFamilyId: this.pieceFamilySelected.id}})};

    this.pieceCategoryControllerService.pieceCategoryControllerFind(filter)
      .subscribe((pieceCategories: any) => {
        this.pieceCategories = pieceCategories;
    },
    err => {
      console.log(err);
    });
  }

  private getSubCategoriesByCategory() {
    let filter: any = {filter: JSON.stringify({where: {pieceCategoryId: this.pieceCategorySelected.id}})};

    this.pieceSubCategoryControllerService.pieceSubCategoryControllerFind(filter)
      .subscribe((pieceSubCategories: any) => {
        this.pieceSubCategories = pieceSubCategories;
    },
    err => {
      console.log(err);
    });
  }

  public onSelectFamily(event: any) {
      // initialize selectors
      this.pieceCategorySelected = undefined;
      this.pieceCategories = [];
      this.pieceSubCategorySelected = undefined;
      this.pieceSubCategories = [];

      // get piece categories
      this.getCategoriesByFamily();
  }

  public onSelectCategory(event: any) {
      this.getSubCategoriesByCategory();
  }

  public addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }
}
