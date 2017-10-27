import { Directive,
         ViewContainerRef,
         ComponentFactoryResolver,
         ComponentRef,
         Input,
         Output,
         EventEmitter,
         HostListener} from '@angular/core';

import { MembersComponent } from './members.component';

@Directive({
  selector: "[member-selection]"
})
export class MembersDirective {

  private members: any[];
  private component: ComponentRef<MembersComponent>;

  @Input('card') card: any;
  @Input('idMembers') idMembers: any[];

  @Output() saveMembers: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private view: ViewContainerRef) { }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    this.showMembers();

    event.stopPropagation();
    event.preventDefault();
  }

  showMembers(): void {
    if (this.component) {
      this.hideMembers();
      return;
    }
    let factory = this.resolver.resolveComponentFactory(MembersComponent);
    this.component = this.view.createComponent(factory);
    this.component.instance.idMembers = this.idMembers;
    this.component.instance.card = this.card;
    this.component.instance.hideMembers.subscribe(() => { this.hideMembers() });
  }

  hideMembers(): void {
    if (this.component) {
      this.component.destroy();
      this.component = null;

      this.saveMembers.emit();
    }
  }


}
