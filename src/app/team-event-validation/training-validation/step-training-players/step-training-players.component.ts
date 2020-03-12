import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { Observable } from 'rxjs';
import { TeamEventValidationService } from '../../team-event-validation.service';

@Component({
	selector: 'app-step-training-players',
	templateUrl: './step-training-players.component.html',
	styleUrls: ['./step-training-players.component.scss']
})
export class StepTrainingPlayersComponent implements OnInit {
	@Input() teamEventId: any;
	@Input() stepTrainingPlayersData: any;
	@Output() stepSelectionEmitter = new EventEmitter<number>();
	isNextBtnDisabled = false;
	playerTimeframeErrors;

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private staticDataService: StaticDataService
	) { }

	ngOnInit() {
		this.playerTimeframeErrors = this.staticDataService.getPlayerTimeframeErrors();
	}

	nextStep() {
		this.stepSelectionEmitter.emit(2);
	}

	backStep() {
		this.stepSelectionEmitter.emit(-1);
	}

	onParticipatingPlayersEmitter(participatingPlayersData) {
		const trainingData = this.teamEventValidationService.getTrainingValidationData();
		let trainingDataCopy = {...trainingData};
		trainingDataCopy.participatingPlayers = participatingPlayersData;
		this.teamEventValidationService.setTrainingValidationData(trainingDataCopy);
	}
}
