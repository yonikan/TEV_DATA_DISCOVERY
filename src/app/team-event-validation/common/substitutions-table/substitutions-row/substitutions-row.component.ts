import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamEventValidationService } from 'src/app/team-event-validation/team-event-validation.service';

@Component({
  selector: 'substitutions-row',
  templateUrl: './substitutions-row.component.html',
  styleUrls: ['./substitutions-row.component.scss']
})
export class SubstitutionsRowComponent implements OnInit {

  @Input() substitution: any; // Substitution
  @Input() rowConfig: any; // RowConfig
  @Input() rowStyle: any; // RowStyle
  @Input() rowMode: string = 'GENERAL';
  @Input() availableForSub: any; // Player[]
  @Input() lineup: any; // Player[]

  @Output() removeRow = new EventEmitter();
  @Output() addRow = new EventEmitter();
  @Output() editRow = new EventEmitter();
  @Output() setSubsList = new EventEmitter();

  substitutionDraft: any; // Substitution

  Object: ObjectConstructor = Object;
  substitutionForDisplay: any; // Substitution
  positions: any; // ?

  constructor(private teamEventValidationService: TeamEventValidationService) {
  }

  ngOnInit() {
    this.setSubId(this.substitution);
    this.setSubForDisplay();
    this.positions = this.teamEventValidationService.getStaticPositionsList();
  }

  setSubId(sub: any /* Substitution */): void {
    sub['subId'] = +`${Date.now()}${Math.round(Math.random()*1000)}`;
    this.substitutionDraft = { ...this.substitution };
  }

  setSubForDisplay(): void {
    const inPlayer = this.teamEventValidationService.getPlayerById(this.substitutionDraft['inPlayerId']);
    const outPlayer = this.teamEventValidationService.getPlayerById(this.substitutionDraft['outPlayerId']);

    if (!this.substitutionDraft['positionId'] && inPlayer.defaultPositionId) {
      this.populateCell(inPlayer.defaultPositionId, 'Position');
      return;
    }

    this.substitutionForDisplay = {
      Minute: this.substitutionDraft['timeMin'] || '',
      In: `${inPlayer.firstName || ''} ${inPlayer.lastName || ''}`,
      Out: `${outPlayer.firstName || ''} ${outPlayer.lastName || ''}`,
      Position: this.substitutionDraft['positionId']? this.teamEventValidationService.getPlayerPositionName(this.substitutionDraft['positionId'], 'shortName') : '',
    }
  }

  getPlayerNameByFormat(playerName: string): string {
    if (!playerName) { return };
    let nameByFormat: any = playerName.split(' ');
    if (!nameByFormat[0] || !nameByFormat[1]) { return };
    nameByFormat = `${nameByFormat[0][0].toUpperCase()}.${nameByFormat[1].toLowerCase()}`;
    return nameByFormat;
  }

  addRowEmit(): void {
    if (this.rowMode === 'NEW' && !this.isSubFull()) { return };
    this.addRow.emit({ substitution: this.substitutionDraft, rowMode: this.rowMode });
    if (this.rowMode === 'EDIT') { this.changeRowMode('GENERAL'); }
    if (this.rowMode === 'NEW') { this.resetSubstitution(); }
  }

  setSubsListEmit(): void {
    this.setSubsList.emit({ substitution: this.substitutionDraft });
  }

  removeRowEmit(): void {
    this.removeRow.emit({ substitution: this.substitutionDraft, rowMode: this.rowMode });
  }

  editRowEmit(): void {
    this.editRow.emit({ substitution: this.substitutionDraft, rowMode: this.rowMode });
    this.changeRowMode('GENERAL');
  }

  changeRowMode(newMode: string): void {
    if (this.rowMode === 'NEW') { return };
    this.rowMode = newMode;
  }

  populateCell(value: any, cell: string, valueIsNum: boolean = false): void {
    if (valueIsNum) { value = +value };
    const map = { Minute: 'timeMin', In: 'inPlayerId', Out: 'outPlayerId', Position: 'positionId' };

    this.substitutionDraft[map[cell]] = value;

    this.setSubForDisplay();
  }

  resetSubstitution(): void {
    this.substitution = {
      id: '',
      inPlayerId: '',
      outPlayerId: '',
      timeMin: ''
    };

    this.substitutionForDisplay = {
      Minute: '',
      In: '',
      Out: '',
      Position: '',
    }
  };

  isSubFull(): boolean {
    return this.substitutionDraft.timeMin && this.substitutionDraft.inPlayerId && this.substitutionDraft.outPlayerId && this.substitutionDraft.positionId;
  }

}
