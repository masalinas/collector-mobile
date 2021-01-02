import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

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
export class GalleryPage {
  private pageNumber = 1;
  private pageLimit = 8;

  public pieces: Piece[];
  public filterTerm: string;
  public gallery: any[] = [];
  public galleryFiltered: any [];

  constructor(public router: Router,
              public modalController: ModalController,
              public toastController: ToastController,
              public pieceControllerService: PieceControllerService,
              public fileControllerService: FileControllerService,
              public photoService: PhotoService) {
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
    let filter: any = {filter: JSON.stringify({include: [{relation: "pieceSubCategory"}]})};

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

  public doInfinite(event) {
    //this.getPieces(true, event);
  }

  public async onShowDetail(item: any) {
    const modal = await this.modalController.create({
      component: PieceCardComponent,
      //cssClass: 'my-custom-class',
      componentProps: {
        //'modal': modal,
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
