import { Component, ViewChild } from '@angular/core';

import { GalleryPage } from './gallery/gallery.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs')
  private tabs: any;

  constructor() {
  }

  public onTabChange(event) {
    if (event.tab === 'gallery') {
      // get tab component instance from tabs
      const galleryPage: GalleryPage = this.tabs.navCtrl.topOutlet.activatedView.ref.instance;

      // refresh pieces to be paint
      galleryPage.getPieces();
    }
  }
}
