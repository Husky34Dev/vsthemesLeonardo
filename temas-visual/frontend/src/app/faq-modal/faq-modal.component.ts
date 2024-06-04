import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq-modal',
  templateUrl: './faq-modal.component.html',
  styleUrls: ['./faq-modal.component.css']
})
export class FaqModalComponent {
  @Input() faqs: Faq[] = [];
  @Output() closeModal = new EventEmitter<void>();

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}
