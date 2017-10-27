import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storytaskfilter',
  pure: false
})
export class StoryTaskFilterPipe implements PipeTransform {
  transform(cards: any[], filter: string): any {
    if (!cards || !filter) {
      return cards;
    }
    return cards.filter(card => card.desc.indexOf('storyId:' + filter) !== -1);
  }
}
