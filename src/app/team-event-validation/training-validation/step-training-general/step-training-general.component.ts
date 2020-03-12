import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { TeamEventValidationService } from '../../team-event-validation.service';
import { VerticesData } from '../../team-event-validation.interface';
import { ParticipatingPlayersService } from '../../common/participating-players/participating-players.service';

@Component({
	selector: 'app-step-training-general',
	templateUrl: './step-training-general.component.html',
	styleUrls: ['./step-training-general.component.scss']
})
export class StepTrainingGeneralComponent implements OnInit, OnChanges {
	@Input() teamEventId: any;
	@Input() stepTrainingGeneralData: any;
	@Output() stepSelectionEmitter = new EventEmitter<number>();
	isNextBtnDisabled = false;
	trainingDuration;
	trainingTags;
	verticesData: VerticesData = {velInterpMs: 0, timeDtMs: 0, startTimeInterpMs: 0};
	highlightedRange = {
		startTime: 0,
		endTime: 0
	};
	isTrainingDurationOn = false;

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private participatingPlayersService: ParticipatingPlayersService
	) { }

	ngOnInit() {
		this.participatingPlayersService.getData(this.teamEventId, 'training');
		// this.teamEventValidationService.phasesVerticesData
		//   .subscribe(verticesData => this.verticesData = verticesData);
		setTimeout(()=>{this.isTrainingDurationOn = true}, 300)
	}

	ngOnChanges() {
		if (this.stepTrainingGeneralData && 'velocityVectors' in this.stepTrainingGeneralData) {
			this.verticesData = this.stepTrainingGeneralData.velocityVectors;

			const d = new Date(this.stepTrainingGeneralData.velocityVectors.startTimeInterpMs + 30 * 60000);
			this.highlightedRange = {
				startTime: this.stepTrainingGeneralData.velocityVectors.startTimeInterpMs,
				endTime: d.getTime()
			}
		}
	}

	nextStep() {
		this.stepSelectionEmitter.emit(1);
	}

	onTrainingDurationEmitter(duration) {
		let trainingData = this.teamEventValidationService.getTrainingValidationData();
		trainingData.metadata.startTime = duration.startTime;
		trainingData.metadata.endTime = duration.endTime;
		this.teamEventValidationService.setTrainingValidationData(trainingData);
	}

	onTagsEmitter(tags) {
		let trimmedTags = [];
		tags.forEach(tag => {
			trimmedTags.push(tag.name);
		});
		const trainingData = this.teamEventValidationService.getTrainingValidationData();
		let trainingDataCopy = {...trainingData};
		trainingDataCopy.metadata.tags = trimmedTags;
		this.teamEventValidationService.setTrainingValidationData(trainingDataCopy);
	}
}
