import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TeamEventValidationService } from '../../team-event-validation.service';

@Component({
  selector: 'app-phases-cards-container',
  templateUrl: './phases-cards-container.component.html',
  styleUrls: ['./phases-cards-container.component.scss']
})
export class PhasesCardsContainerComponent implements OnInit {

  @Input() cards: any[] = [];
  @Output() teamEventPhasesEmitter = new EventEmitter<any>();

  index: number = 0;

  config: SwiperConfigInterface = {
    direction: 'horizontal',
    keyboard: true,
    grabCursor: true,
    observer: true,
    spaceBetween: 20,
    slidesPerView: 4.2,
    navigation: false,
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
    breakpoints: {
      1025: {
        slidesPerView: 1.2
      },
      1441: {
        slidesPerView: 2.2
      },
      1741: {
        slidesPerView: 3.2
      },
      1921: {
        slidesPerView: 4.2
      }
    }
  };

  constructor(private teamEventValidationService: TeamEventValidationService) {
  }

  ngOnInit() {
    if (this.cards && !this.cards.length) {
      this.addEmptyCard();
    }
  }

  getPhaseName(phase, index) {
    const phaseName = this.getMatchPhaseNameById(phase.subType);
    if (phaseName === 'warmUp') { return };
    index = this.getMatchPhaseNameById(this.cards[0].subType) !== 'warmUp' ? index : (index - 1);
    const currentMatchPhaseObj = this.teamEventValidationService.getStaticMatchPhasesList()[index];
    return currentMatchPhaseObj.name;
  }

  getMatchPhaseNameById(id) {
    return this.teamEventValidationService.getMatchPhaseNameById(id);
  }

  addEmptyCard(): void {
    this.cards = [
      {
        id: '',
        type: '',
        name: '',
        startTime: '',
        endTime: '',
        offset: '',
        numberOfSubs: ''
      },
    ]
  }

  onDeleteCard(cardIdToDelete: number): void {
    const cardIndex = this.cards.findIndex(card => card.id === cardIdToDelete);
    this.cards.splice(cardIndex, 1);
  }

  updatePhase(updatedPhase: any): void {
    const index = this.cards.findIndex((card) => { return card.id === updatedPhase.id });
    this.cards[index] = updatedPhase;
    this.cards.sort((a, b) => a.startTime - b.startTime);
    this.teamEventPhasesEmitter.emit(this.cards);
  }
}
