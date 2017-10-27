import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberfilter',
  pure: false
})
export class MemberFilterPipe implements PipeTransform {
  transform(members: any[], filter: any[]): any {
    if (!members || !filter) {
      return members;
    }
    return members.filter(member => filter.indexOf(member.id) > -1);
  }
}
