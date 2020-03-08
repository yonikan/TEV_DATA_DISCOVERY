import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TeamEventValidationService } from '../../team-event-validation.service';
import { VerticesData } from '../../team-event-validation.interface';

@Component({
	selector: 'app-step-match-phases',
	templateUrl: './step-match-phases.component.html',
	styleUrls: ['./step-match-phases.component.scss']
})
export class StepMatchPhasesComponent implements OnInit, OnChanges {
	@Input() stepMatchPhasesData: any;
	@Output() stepSelectionEmitter = new EventEmitter<number>();

	verticesData: VerticesData;
	highlightedRange = {
		startTime: 0,
		endTime: 0
	};
	plotBands = [];

	constructor(private teamEventValidationService: TeamEventValidationService) { }

	ngOnInit() {

	}

	ngOnChanges() {
		if (this.stepMatchPhasesData && 'velocityVector' in this.stepMatchPhasesData) {
			this.verticesData = this.stepMatchPhasesData.velocityVector;
		}
		if(this.stepMatchPhasesData.phasesList){
			this.plotBands = this.stepMatchPhasesData.phasesList.map(({startTime, endTime}) => ({from: startTime, to: endTime}));
		}
	}

	nextStep() {
		this.teamEventValidationService.matchDataOutput.step4PhasesData = this.stepMatchPhasesData;
		this.stepSelectionEmitter.emit(4);
	}

	previousStep() {
		this.stepSelectionEmitter.emit(-1);
	}

	onMatchPhasesEmitter(updatedPhases) {
   	    this.stepMatchPhasesData.phases = updatedPhases;
		const matchData = this.teamEventValidationService.getMatchValidationData();
		let matchDataCopy = {...matchData};
		matchDataCopy.phases.phasesList = updatedPhases;
		this.teamEventValidationService.setMatchValidationData(matchDataCopy);
	}
}
