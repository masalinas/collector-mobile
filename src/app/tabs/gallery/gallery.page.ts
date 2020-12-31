import { Component, ViewChild } from '@angular/core';

import { ModalController, ToastController, IonItemSliding } from '@ionic/angular';
import { PieceCardComponent } from './piece-card/piece-card.component';
import { PiecePage } from '../piece/piece.page';

import { Photo, PhotoService } from '../../services/photo.service';

import { Piece } from '../../shared/services/backend/model/models';
import { PieceControllerService,
         FileDownloadControllerService} from '../../shared/services/backend/api/api';

@Component({
  selector: 'app-gallery',
  templateUrl: 'gallery.page.html',
  styleUrls: ['gallery.page.scss']
})
export class GalleryPage {
  public pieces: Piece[];
  public filterTerm: string;
  public gallery: any[] = [];
  public galleryFiltered: any [];

  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;

  constructor(public modalController: ModalController,
              public toastController: ToastController,
              public pieceControllerService: PieceControllerService,
              public fileDownloadControllerService: FileDownloadControllerService,
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
          this.fileDownloadControllerService.fileDownloadControllerDownloadFile(piece.fileName)
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
      //cssClass: 'my-custom-class',
      componentProps: {
        //'modal': modal,
        'item': item
      }
    });

    return await modal.present();
  }

  public async onUpdatePiece(item: any) {
      const modal = await this.modalController.create({
        component: PiecePage,
        componentProps: {
          //'modal': modal,
          'item': item
        }
      });

      await modal.present();
      await modal.onDidDismiss();

      this.slidingItem.close();
  }

  public onDeletePiece(item: any) {
    this.pieceControllerService.pieceControllerDeleteById(item.piece.id)
      .subscribe((result: any) => {
        this.getPieces();

        this.presentToast('Your piece have been removed.');
    },
    err => {
      console.log(err);
    });
  }
}
