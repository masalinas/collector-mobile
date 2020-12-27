import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PieceFilter' })
export class PieceFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.piece.name.toLocaleLowerCase().includes(searchText);
    });
  }
}