import { Component } from '@angular/core';

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
  public gallery: any[] = [];

  constructor(public pieceControllerService: PieceControllerService,
              public fileDownloadControllerService: FileDownloadControllerService,
              public photoService: PhotoService) {
    this.getPieces();
  }

  convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
  });

  private getPieces() {
    this.pieceControllerService.pieceControllerFind()
      .subscribe((pieces: any) => {
        this.pieces = pieces;

        this.pieces.forEach(piece => {
          this.fileDownloadControllerService.fileDownloadControllerDownloadFile(piece.fileName)
            .subscribe(async (blob: any) => {
              //console.log(blob);
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
}
