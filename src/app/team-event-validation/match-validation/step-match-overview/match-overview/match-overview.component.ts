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

  competitionOptions: any;

  moment: any = moment;

  constructor(public teamEventValidationService: TeamEventValidationService) { }

  ngOnInit() {
    this.competitionOptions = this.teamEventValidationService.getStaticCompetitionsList();
    this.setDefaults();
    // console.log(this.stepMatchOverviewData);
  }

  setDefaults(): void {
    if (!this.stepMatchOverviewData) { return; };
    if (!this.stepMatchOverviewData.competition) { this.setGameData(1, 'competition') };
    if (!this.stepMatchOverviewData.vanue) { this.setGameData(1, 'vanue') };
    if (!this.stepMatchOverviewData.myScore) { this.setGameData(0, 'myScore') };
    if (!this.stepMatchOverviewData.opponentScore) { this.setGameData(0, 'opponentScore') };
  }

  populateData(value: any, keyToUpdate: string): void {
    this.stepMatchOverviewData[keyToUpdate] = value;
  }

  setGameData(value: any, stepDataKey: string): void {
    this.populateData(value, stepDataKey);
    this.matchOverviewEmitter.emit(this.stepMatchOverviewData);
  }

  updateScore(event: any, side: string): void {
    let score = +event.target.value;
    if (score < 0 || score > 99) { score = 0 };
    if (score % 1 !== 0) { score = Math.floor(score) };
    if (side === 'HOME') { this.setGameData(score, 'myScore') };
    if (side === 'AWAY') { this.setGameData(score, 'opponentScore') };
  }

  sendToTeamEvent(data: any) {
    this.matchOverviewEmitter.emit(data);
  }
}
