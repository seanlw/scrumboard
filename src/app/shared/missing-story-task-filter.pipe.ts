import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'missingstorytaskfilter',
  pure: false
})
export class MissingStoryTaskFilterPipe implements PipeTransform {
  transform(cards: any[]): any {
    if (!cards) {
      return cards;
    }
    return cards.filter(card => card.desc.indexOf('storyId:') === -1);
  }
}
