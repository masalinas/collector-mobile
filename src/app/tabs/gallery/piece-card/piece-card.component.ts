import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Piece } from '../../../shared/services/backend/model/models';
import { PieceControllerService,
         FileDownloadControllerService} from '../../../shared/services/backend/api/api';

@Component({
  selector: 'piece-card',
  templateUrl: 'piece-card.component.html',
  styleUrls: ['piece-card.component.scss']
})
export class PieceCardComponent {
  public pieces: Piece[];
  public gallery: any[] = [];

  @Input() item: any;

  constructor(public modalController: ModalController,) {
  }  

  public dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
