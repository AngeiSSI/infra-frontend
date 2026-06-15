import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  @Input() appHighlight = 'yellow';
  @Input() highlightColor = 'yellow';

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.destacar(this.appHighlight || this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.destacar(null);
  }

  private destacar(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.transition = 'background-color 0.2s ease';
  }
}