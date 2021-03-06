import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamEventValidationService } from '../../team-event-validation.service';

@Component({
	selector: 'app-step-match-subs',
	templateUrl: './step-match-subs.component.html',
	styleUrls: ['./step-match-subs.component.scss']
})
export class StepMatchSubsComponent implements OnInit {
	@Input() stepMatchSubsData: any; // Substitution[]
  @Output() stepSelectionEmitter = new EventEmitter<number>();
	@Output() onValidate = new EventEmitter<boolean>();


	constructor(public teamEventValidationService: TeamEventValidationService) { }

	ngOnInit() {
	}

	validateMatch(): void {
		this.teamEventValidationService.matchDataOutput.step5SubsData = this.stepMatchSubsData;
		this.stepSelectionEmitter.emit(5);
	}

	previousStep(): void {
		this.stepSelectionEmitter.emit(-1);
  }

  checkIfSubsAreValid(event): void{
		this.onValidate.emit(event.isValid);
    if (event.isValid) {
      this.onMatchSubsEmitter(event);
    }
  }

	onMatchSubsEmitter(matchSubsData) {
		const matchData = this.teamEventValidationService.getMatchValidationData();
		let matchDataCopy = {...matchData};
		matchDataCopy.substitutions.subList = matchSubsData.substitutions;
    matchDataCopy.substitutions.suggestedSubs = matchSubsData.suggestedSubs;
		this.teamEventValidationService.setMatchValidationData(matchDataCopy);
	}
}
