import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';

import { Photo, PhotoService } from '../../services/photo.service';

import { PieceFamily,
         PieceCategory,
         PieceSubCategory,
         Piece
       } from '../../shared/services/backend/model/models';
import { PieceFamilyControllerService,
         PieceCategoryControllerService,
         PieceSubCategoryControllerService,
         FileUploadControllerService,
         PieceControllerService
       } from '../../shared/services/backend/api/api';

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

  public pieceFamilies: PieceFamily[];
  public pieceCategories: PieceCategory[];
  public pieceSubCategories: PieceSubCategory[];

  constructor(public actionSheetController: ActionSheetController,
              public modalController: ModalController,
              public toastController: ToastController,
              public pieceFamilyControllerService: PieceFamilyControllerService,
              public pieceCategoryControllerService: PieceCategoryControllerService,
              public pieceSubCategoryControllerService: PieceSubCategoryControllerService,
              public pieceControllerService: PieceControllerService,
              public fileUploadControllerService: FileUploadControllerService,
              public photoService: PhotoService) { }

  async ngOnInit() {
    this.getFamilies();

    // load images from storage
    //await this.photoService.loadSaved();
  }

  private initializeForm() {
    this.pieceFamilySelected = undefined;
    this.pieceCategorySelected = undefined;
    this.pieceCategories = [];
    this.pieceSubCategorySelected = undefined;
    this.pieceSubCategories = [];
    this.pieceNameSelected = undefined;

    this.photoService.photos = [];
  }

  private async presentToast(message: string) {
     const toast = await this.toastController.create({
       message: message,
       duration: 2000
     });
     toast.present();
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
    if (this.pieceFamilySelected) {
      let filter: any = {filter: JSON.stringify({where: {pieceFamilyId: this.pieceFamilySelected.id}})};

      this.pieceCategoryControllerService.pieceCategoryControllerFind(filter)
        .subscribe((pieceCategories: any) => {
          this.pieceCategories = pieceCategories;
      },
      err => {
        console.log(err);
      });
    }
  }

  private getSubCategoriesByCategory() {
    if (this.pieceCategorySelected) {
      let filter: any = {filter: JSON.stringify({where: {pieceCategoryId: this.pieceCategorySelected.id}})};

      this.pieceSubCategoryControllerService.pieceSubCategoryControllerFind(filter)
        .subscribe((pieceSubCategories: any) => {
          this.pieceSubCategories = pieceSubCategories;
      },
      err => {
        console.log(err);
      });
    }
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

  public cancelPiece(event: any) {
    this.initializeForm();

    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public async savePiece(event: any) {
    if (this.pieceFamilySelected === undefined ||
        this.pieceCategorySelected === undefined ||
        this.pieceSubCategorySelected  === undefined ||
        this.pieceNameSelected  === undefined ||
        this.photoService.photos.length === 0) {
          this.presentToast('Fill all mandatory piece fields.');

          return;
        }

    // get the first image from local storage
    const base64Response = await fetch(this.photoService.photos[0].webviewPath!);

    // get blob and filename
    const blob = await base64Response.blob();
    const fileName: string = new Date().getTime() + '.jpeg';

    // upload the image of the piece
    this.fileUploadControllerService.fileUploadControllerFileUpload(blob, fileName)
      .subscribe((result: any) => {
        // create a new piece
        let piece: Piece = {
          pieceFamilyId: this.pieceFamilySelected.id,
          pieceCategoryId: this.pieceCategorySelected.id,
          pieceSubCategoryId: this.pieceSubCategorySelected.id,
          name: this.pieceNameSelected,
          fileName: fileName,
          country: 'us',
          creationDate: new Date()
        };

        this.pieceControllerService.pieceControllerCreate(piece)
          .subscribe((result: any) => {
            this.initializeForm();

            this.presentToast('Your piece have been saved.');
        },
        err => {
          console.log(err);
        });
    },
    err => {
      console.log(err);
    });
  }
}
