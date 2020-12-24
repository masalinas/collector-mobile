import { Component, OnInit } from '@angular/core';

import { PhotoService } from '../services/photo.service';

import { Piece } from '../shared/services/backend/model/models';
import { PieceControllerService } from '../shared/services/backend/api/api';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  private pieces: Piece[];

  constructor(public pieceControllerService: PieceControllerService,
              public photoService: PhotoService) { }

  ngOnInit() {
    this.pieceControllerService.pieceControllerFind()
      .subscribe((pieces: any) => {
        this.pieces = pieces;
    },
    err => {
      console.log(err);
    });
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
