import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ModalController, ToastController, IonItemSliding } from '@ionic/angular';

import { PieceCardComponent } from './piece-card/piece-card.component';
import { PiecePage } from '../piece/piece.page';

import { Photo, PhotoService } from '../../services/photo.service';

import { Piece } from '../../shared/services/backend/model/models';
import { PieceControllerService, FileControllerService} from '../../shared/services/backend/api/api';

@Component({
  selector: 'tab-gallery',
  templateUrl: 'gallery.page.html',
  styleUrls: ['gallery.page.scss']
})
export class GalleryPage implements OnInit {
  private pageNumber = 1;
  private pageLimit = 8;

  public subCategoryId: string;
  public pieces: Piece[];
  public filterTerm: string;
  public gallery: any[] = [];
  public galleryFiltered: any [];

  constructor(public router: Router,
              private route: ActivatedRoute,
              public modalController: ModalController,
              public toastController: ToastController,
              public pieceControllerService: PieceControllerService,
              public fileControllerService: FileControllerService,
              public photoService: PhotoService) {
  }

  ngOnInit() {
    this.subCategoryId = this.route.snapshot.paramMap.get('subCategoryId');

    this.getPieces();
  }

  private async presentToast(message: string) {
     const toast = await this.toastController.create({
       message: message,
       duration: 2000
     });
     toast.present();
   }

  convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;

      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };

      reader.readAsDataURL(blob);
  });

  public getPieces() {
    let query: any = {filter: {}};

    query.filter.include = [{relation: "pieceSubCategory"}];

    if (this.subCategoryId) {
      query.filter.where = {pieceSubCategoryId: this.subCategoryId}
    }

    let filter: any = {filter: JSON.stringify(query.filter)};

    this.pieceControllerService.pieceControllerFind(filter)
      .subscribe((pieces: any) => {
        this.pieces = pieces;

        this.gallery = [];
        this.pieces.forEach(piece => {
          this.fileControllerService.fileControllerDownloadFile(piece.fileName)
            .subscribe(async (blob: any) => {
              const imagePath = await this.convertBlobToBase64(blob);

              this.gallery.push({piece: piece, imagePath: imagePath});
          },
          err => {
            console.log(err);
          });
        });
    },
    err => {
      console.log(err);
    });
  }

  public onSearch(event) {
    this.galleryFiltered = this.gallery.filter(item => item.piece.name.includes(event.target.value));
  }

  public async onShowDetail(item: any) {
    const modal = await this.modalController.create({
      component: PieceCardComponent,
      componentProps: {
        'item': item
      }
    });

    return await modal.present();
  }

  public async onUpdatePiece(component: any, item: any) {
    const ionItemSliding: IonItemSliding = component;

    const modal = await this.modalController.create({
        component: PiecePage,
        componentProps: {
          'piece': item
        }
    });

    modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
                const value = dataReturned.data;

                // autoclose ion slide menu
                ionItemSliding.close();

                // refresh images
                if (value.saved === true)
                  this.getPieces();
          }
    });

    await modal.present();
  }

  public onDeletePiece(item: any) {
    this.fileControllerService.fileControllerDeleteByName(item.piece.fileName)
      .subscribe((result: any) => {
        this.pieceControllerService.pieceControllerDeleteById(item.piece.id)
          .subscribe((result: any) => {
            this.getPieces();

            this.presentToast('Your piece have been removed.');
        },
        err => {
          console.log(err);
        });
    },
    err => {
      console.log(err);
    });
  }

  public addPiece(event) {
    this.router.navigate(['tabs/piece']);
  }
}
