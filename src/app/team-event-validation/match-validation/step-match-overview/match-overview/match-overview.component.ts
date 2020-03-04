import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StaffRoles } from '../../../../core/enums/staff-roles.enum';
import * as moment from 'moment';
import { TeamEventValidationService } from 'src/app/team-event-validation/team-event-validation.service';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {

  @Input() stepMatchOverviewData: any;
  @Output() matchOverviewEmitter = new EventEmitter<any>();

  competitionOptions;

  // selectedCompetition;
  dataManager = {
    selectedCompetition: null,
    selecedHost: null,
    selectedScore: null,
    selectedOpponentScore: null,
    selectedOpponent: null
  };

  moment = moment;

  constructor(public teamEventValidationService: TeamEventValidationService) { }

  ngOnInit() {
    // console.log('getStaticPositionsList: ', this.teamEventValidationService.getStaticPositionsList());
    this.competitionOptions = this.teamEventValidationService.getStaticCompetitionsList();
    this.setDefaults();
    // console.log(this.stepMatchOverviewData);
  }

  setDefaults() {
    if (!this.stepMatchOverviewData) { return; };
    if (!this.stepMatchOverviewData.competition) { this.setGameData(1, 'selectedCompetition', 'competition') };
    if (!this.stepMatchOverviewData.vanue) { this.setGameData(1, 'selecedHost', 'vanue') };
    if (!this.stepMatchOverviewData.myScore && this.stepMatchOverviewData.myScore !== 0) { this.setGameData(0, 'selectedScore', 'myScore') };
    if (!this.stepMatchOverviewData.opponentScore && this.stepMatchOverviewData.opponentScore !== 0) { this.setGameData(0, 'selectedOpponentScore', 'opponentScore') };
  }

  populateData(value, keyToUpdate) {
    this.stepMatchOverviewData[keyToUpdate] = value;
  }

  setGameData(value, dataManagerKey, stepDataKey) {
    this.dataManager[dataManagerKey] = value;
    this.populateData(value, stepDataKey);
    this.matchOverviewEmitter.emit(this.stepMatchOverviewData);
  }

  updateScore(event, side) {
    let score = +event.target.value;
    if (score < 0 || score > 99) { score = 0 };
    if (score % 1 !== 0) { score = Math.floor(score) };
    if (side === 'HOME') { this.setGameData(score, 'selectedScore', 'myScore') };
    if (side === 'AWAY') { this.setGameData(score, 'selectedOpponentScore', 'opponentScore') };
    event.target.value = score;
  }

  sendToTeamEvent(data) {
    this.matchOverviewEmitter.emit(data);
  }
}
