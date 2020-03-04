import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-formation-selection',
  templateUrl: './formation-selection.component.html',
  styleUrls: ['./formation-selection.component.scss']
})
export class FormationSelectionComponent implements OnInit, OnChanges {
  @Input() tabs;
  @Input() tactics;
  @Input() definedSubs;
  @Input() positions;
  @Input() selectedTacticId;

  @Output() onSelectTactic = new EventEmitter();
  @Output() onSelectDefinedSub = new EventEmitter();
  @Output() formationSelectionEmitter = new EventEmitter<any>();

  selectedTactic = null;

  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.tactics && this.tactics.length && !this.selectedTactic) {
		if (this.selectedTacticId) {
			this.tactics.some(tactic => {
				if (tactic._id === this.selectedTacticId) {
					this.selectedTactic = tactic;
					return true;
				}
				return false;
			});
		} else {
			[this.selectedTactic] = this.tactics;
		}

      this.selectTactic({value: this.selectedTactic});
    }
  }

  selectTactic({value}) {
    this.onSelectTactic.emit(value);
  }

  selectSub({value}) {
    this.onSelectDefinedSub.emit(value);
  }

  sendToTeamEvent(data) {
    this.formationSelectionEmitter.emit(data);
  }
}
