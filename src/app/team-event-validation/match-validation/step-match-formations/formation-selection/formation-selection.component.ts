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
  @Input() selectedFormationId;

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
		if (this.selectedFormationId) {
			this.tactics.some(tactic => {
				if (tactic.id === this.selectedFormationId) {
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
	this.sendToTeamEvent(value);
  }

  selectSub({value}) {
    this.onSelectDefinedSub.emit(value);
  }

  sendToTeamEvent(data) {
    this.formationSelectionEmitter.emit(data);
  }
}
