import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { PieceCardComponent } from './piece-card/piece-card.component';

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

  constructor(public modalController: ModalController,
              public pieceControllerService: PieceControllerService,
              public fileDownloadControllerService: FileDownloadControllerService,
              public photoService: PhotoService) {
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

  public async showDetail(item: any) {
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

  public onSearch(event) {    
    this.galleryFiltered = this.gallery.filter(item => item.piece.name.includes(event.target.value));
  }
}
