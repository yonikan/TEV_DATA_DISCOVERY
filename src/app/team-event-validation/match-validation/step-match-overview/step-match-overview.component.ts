import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { TeamEventValidationService } from '../../team-event-validation.service';
import { ParticipatingPlayersService } from '../../common/participating-players/participating-players.service';

@Component({
  selector: 'app-step-match-overview',
  templateUrl: './step-match-overview.component.html',
  styleUrls: ['./step-match-overview.component.scss']
})
export class StepMatchOverviewComponent implements OnInit {
  @Input() stepMatchOverviewData: any;
  @Input() teamEventId;
  @Output() stepSelectionEmitter = new EventEmitter<number>();

  constructor(
    private teamEventValidationService: TeamEventValidationService,
    private participatingPlayersService: ParticipatingPlayersService
  ) { }

  ngOnInit() {
	  this.participatingPlayersService.getData(this.teamEventId, 'match');
  }

  nextStep() {
    this.teamEventValidationService.matchDataOutput.step1OverviewData = this.stepMatchOverviewData;
    this.stepSelectionEmitter.emit(1);
  }

  onMatchOverviewEmitter(matchOverviewData) {
    const matchData = this.teamEventValidationService.getMatchValidationData();
		let matchDataCopy = {...matchData};
    matchDataCopy.metadata.vanue = matchOverviewData.vanue;
    matchDataCopy.metadata.myScore = matchOverviewData.myScore;
    matchDataCopy.metadata.opponentScore = matchOverviewData.opponentScore;
    matchDataCopy.metadata.opponentName = matchOverviewData.opponentName;
    matchDataCopy.metadata.competition = matchOverviewData.competition;
    matchDataCopy.metadata.availableOpponentList = matchOverviewData.availableOpponentList;
		this.teamEventValidationService.setMatchValidationData(matchDataCopy);
    console.log(this.teamEventValidationService.getMatchValidationData())
  }

  onTagsEmitter(tags) {
		let trimmedTags = [];
		tags.forEach(tag => {
			trimmedTags.push(tag.name);
		});
		let matchData = this.teamEventValidationService.getMatchValidationData();
		matchData.metadata.tags = trimmedTags;
		this.teamEventValidationService.setMatchValidationData(matchData);
  }
}
