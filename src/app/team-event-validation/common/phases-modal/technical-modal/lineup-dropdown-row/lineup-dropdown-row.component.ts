import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamEventValidationService } from '../../../../team-event-validation.service';

@Component({
  selector: 'app-lineup-dropdown-row',
  templateUrl: './lineup-dropdown-row.component.html',
  styleUrls: ['./lineup-dropdown-row.component.scss']
})
export class LineupDropdownRowComponent implements OnInit {

  @Input() player: any = {};
  @Input() rowMode = 'OPPOESED'; //OPPOSEED_LINEUP
  @Input() selectedTeam: number;
  @Input() disable: any = false;
  @Input() phase;

  @Output() lineupRowClicked = new EventEmitter();

  constructor(public teamEventValidationService: TeamEventValidationService) { }

  ngOnInit() {
    // console.log('row: ', this.selectedTeam);
    this.disable = this.isDisabeled();
  }

  toggleSelectRow(team) {
    if ( this.rowMode === 'OPPOSEED_LINEUP' ) { return };
    if (this.selectedTeam === 1) {
      this.unSelectRow();
    } else {
      this.selectRow(team);
    }
  }

  selectRow(team: number, event?: MouseEvent) {
    if (team === this.selectedTeam) { return };
    if (event) { event.stopPropagation(); };
    this.emit(team);
    this.selectedTeam = team;
  }

  unSelectRow() {
    this.selectedTeam = null;
    this.emit(this.selectedTeam, true);
  }

  emit(team, remove = false) {
    this.lineupRowClicked.emit({ player: this.player, rowMode: this.rowMode, team, prevTeam: this.selectedTeam, remove });
  }


  isDisabeled() {
    // console.log('isPhaseOverlap: ', this.service.isPhaseOverlap(this.player.playerId, this.phase))
    return this.teamEventValidationService.isPhaseOverlap(this.player.id, this.phase);
  }
}
