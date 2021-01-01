import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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
         FileControllerService,
         PieceControllerService
       } from '../../shared/services/backend/api/api';

@Component({
  selector: 'app-piece',
  templateUrl: 'piece.page.html',
  styleUrls: ['piece.page.scss']
})
export class PiecePage implements OnInit {
  public pieceFormGroup: FormGroup = this.formBuilder.group({
     pieceFamilyId: new FormControl('', Validators.compose([Validators.required])),
     pieceCategoryId: new FormControl('', Validators.compose([Validators.required])),
     pieceSubCategoryId: new FormControl('', Validators.compose([Validators.required])),
     name: new FormControl('', Validators.compose([Validators.required]))
  });

  public photoSelected: any;
  public pieceSelected: Piece;

  public pieceFamilies: PieceFamily[];
  public pieceCategories: PieceCategory[];
  public pieceSubCategories: PieceSubCategory[];

  constructor(private formBuilder:FormBuilder,
              public actionSheetController: ActionSheetController,
              public modalController: ModalController,
              public toastController: ToastController,
              public pieceFamilyControllerService: PieceFamilyControllerService,
              public pieceCategoryControllerService: PieceCategoryControllerService,
              public pieceSubCategoryControllerService: PieceSubCategoryControllerService,
              public pieceControllerService: PieceControllerService,
              public fileControllerService: FileControllerService,
              public photoService: PhotoService) {
      // initialize variables
      this.initializeForm();
  }

  async ngOnInit() {
    // get families
    this.getFamilies();
  }

  @Input() public set piece(item: any) {
    this.pieceSelected = item.piece;

    // bind piece metadata
    this.getFamilies();

    this.pieceFormGroup.controls.name.setValue(this.pieceSelected.name);

    // piece piece image
    this.photoSelected = {filepath: item.piece.fileName,
                          webviewPath: item.imagePath,
                          fileName: item.piece.fileName};
    this.photoService.photos.push(this.photoSelected);
  }

  private initializeForm() {
    this.pieceFormGroup.reset({});

    this.pieceCategories = [];
    this.pieceSubCategories = [];
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

        if (this.pieceSelected) {
          this.pieceFormGroup.controls.pieceFamilyId.setValue(this.pieceSelected.pieceFamilyId);

          this.getCategoriesByFamily();
        }
    },
    err => {
      console.log(err);
    });
  }

  private getCategoriesByFamily() {
    if (this.pieceFormGroup.controls.pieceFamilyId) {
      let filter: any = {filter: JSON.stringify({where: {pieceFamilyId: this.pieceFormGroup.controls.pieceFamilyId.value}})};

      this.pieceCategoryControllerService.pieceCategoryControllerFind(filter)
        .subscribe((pieceCategories: any) => {
          this.pieceCategories = pieceCategories;

          if (this.pieceSelected) {
            this.pieceFormGroup.controls.pieceCategoryId.setValue(this.pieceSelected.pieceCategoryId);

            this.getSubCategoriesByCategory();
          }
      },
      err => {
        console.log(err);
      });
    }
  }

  private getSubCategoriesByCategory() {
    if (this.pieceFormGroup.controls.pieceCategoryId) {
      let filter: any = {filter: JSON.stringify({where: {pieceCategoryId: this.pieceFormGroup.controls.pieceCategoryId.value}})};

      this.pieceSubCategoryControllerService.pieceSubCategoryControllerFind(filter)
        .subscribe((pieceSubCategories: any) => {
          this.pieceSubCategories = pieceSubCategories;

          if (this.pieceSelected) {
            this.pieceFormGroup.controls.pieceSubCategoryId.setValue(this.pieceSelected.pieceSubCategoryId);
          }
      },
      err => {
        console.log(err);
      });
    }
  }

  public onSelectFamily(event: any) {
      // initialize selectors
      this.pieceFormGroup.controls.pieceCategoryId.setValue(undefined);
      this.pieceCategories = [];
      this.pieceFormGroup.controls.pieceSubCategoryId.setValue(undefined);
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
          this.photoSelected = photo;
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

  public async cancelPiece(event: any) {
    this.initializeForm();

    const isModalOpened = await this.modalController.getTop();

    if (isModalOpened) {
      this.modalController.dismiss({
        'saved': false
      });
    }
  }

  public async savePiece(event: any) {
    const isModalOpened = await this.modalController.getTop();

    // get the first blob and filename from photos collection
    const base64Response = await fetch(this.photoService.photos[0].webviewPath!);

    const blob = await base64Response.blob();
    const fileName: string = this.photoService.photos[0].fileName;

    // update a piece
    if (isModalOpened) {
      // STEP01: remove the previous image
      this.fileControllerService.fileControllerDeleteByName(this.pieceSelected.fileName)
        .subscribe((result: any) => {
          // STEP02: create the new image
          this.fileControllerService.fileControllerFileUpload(blob, fileName)
            .subscribe((result: any) => {
              let piece: Piece = {
                pieceFamilyId: this.pieceFormGroup.value.pieceFamilyId,
                pieceCategoryId: this.pieceFormGroup.value.pieceCategoryId,
                pieceSubCategoryId: this.pieceFormGroup.value.pieceSubCategoryId,
                name: this.pieceFormGroup.value.name,
                fileName: fileName,
                country: 'us',
                creationDate: new Date()
              };

              // STEP03: create the new piece attached to the image
              this.pieceControllerService.pieceControllerReplaceById(this.pieceSelected.id, piece)
                .subscribe((result: any) => {
                  this.modalController.dismiss({
                    'saved': true
                  });
              },
              err => {
                console.log(err);
              });
          },
          err => {
            console.log(err);
          });
      },
      err => {
        console.log(err);
      });
    }
    // create a piece
    else {
      // STEP01: create the new image
      this.fileControllerService.fileControllerFileUpload(blob, fileName)
        .subscribe((result: any) => {
          let piece: Piece = {
            pieceFamilyId: this.pieceFormGroup.value.pieceFamilyId,
            pieceCategoryId: this.pieceFormGroup.value.pieceCategoryId,
            pieceSubCategoryId: this.pieceFormGroup.value.pieceSubCategoryId,
            name: this.pieceFormGroup.value.name,
            fileName: fileName,
            country: 'us',
            creationDate: new Date()
          };

          // STEP02: create the new piece attached to the image
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
}
