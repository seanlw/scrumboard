import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardlistfilter',
  pure: false
})
export class CardListFilterPipe implements PipeTransform {
  transform(cards: any[], filter: string): any {
    if (!cards || !filter) {
      return cards;
    }
    return cards.filter(card => card.idList === filter);
  }
}
