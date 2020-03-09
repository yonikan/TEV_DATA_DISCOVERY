import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { TeamEventValidationService } from '../team-event-validation.service';
import { UiComponentsService } from '../../core/services/ui-components.service';
import { TeamOverviewService } from '../../team-overview/team-overview.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';

@Component({
	selector: 'app-match-validation',
	templateUrl: './match-validation.component.html',
	styleUrls: ['./match-validation.component.scss']
})
export class MatchValidationComponent implements OnInit, OnDestroy {
	@Input() matchId: number;
	@ViewChild('stepper', { static: false }) stepper: ElementRef;
	isLoading = true;
	currentSelectedStep = 0;
	step1Data: any;
	step2Data: any;
	step3Data: any;
	step4Data: any;
	step5Data: any;
	matchValidationData: any;
	private matchValidationDataSub: Subscription;

	steps = [
		{name: 'OVERVIEW', isCompleted: false, isLastStep: false, id: 0},
		{name: 'PLAYERS', isCompleted: false, isLastStep: false, id: 1},
		{name: 'FORMATIONS', isCompleted: false, isLastStep: false, id: 2},
		{name: 'PHASES', isCompleted: false, isLastStep: false, id: 3},
		{name: 'SUBS', isCompleted: false, isLastStep: true, id: 4}
	];
	currentStep: any = 0;
	isValid: boolean;
	stepValidation = {
		0: true,
		1: true,
		2: true,
		3: true,
		4: true,
	}
	positions: Observable<any>;

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private teamOverviewService: TeamOverviewService,
		private uiComponentsService: UiComponentsService,
		private staticDataService: StaticDataService
	) { }

	ngOnInit() {
		this.positions = this.staticDataService.getData('positions', 'team-event-validation');
		this.teamEventValidationService.fetchMatch(this.matchId);
		this.matchValidationDataSub = this.teamEventValidationService
			.getMatchValidationDataListener()
			.subscribe((matchValidationData: any) => {
				const matchValidationDataCopy = JSON.parse(JSON.stringify(matchValidationData));
        const currMatchValidationData = this.teamEventValidationService.getMatchValidationData();
				if(currMatchValidationData && Object.keys(currMatchValidationData).length) {
        //   this.teamEventValidationService.setMatchValidationData(matchValidationDataCopy);
          this.teamEventValidationService.setFormation();
				}
				this.isLoading = false;
				this.step1Data = matchValidationDataCopy.metadata;
				this.step2Data = matchValidationDataCopy.participatingPlayers;
				this.step3Data = {
					formation: matchValidationDataCopy.formation,
					participatingPlayers: matchValidationDataCopy.participatingPlayers,
					selectedFormationId: matchValidationDataCopy.selectedFormationId };
				this.step4Data = { ...matchValidationDataCopy.phases, ...matchValidationDataCopy.metadata };
        this.step5Data = matchValidationDataCopy.substitutions;
			});
	}

	onStepSelectionEmitter(stepNumber, step, stepper) {
		this.teamEventValidationService.onStepSelection(stepNumber, step, stepper, () => {
			this.isLoading = true;
			this.teamEventValidationService.validateMatch(this.matchId)
				.subscribe(
					(matchResp: any) => {
						this.isLoading = false;
						this.uiComponentsService.setIsSidepanelOpen(
							{ isOpen: false, teamEventType: null, teamEventId: null, isTeamEventValidationFinished: true }
						);
					},
					(error) => {
						this.teamOverviewService.setTeamEventAfterValidation(this.matchId);
						this.isLoading = false;
						this.uiComponentsService.setIsSidepanelOpen(
							{ isOpen: false, teamEventType: null, teamEventId: null, isTeamEventValidationFinished: false }
						);
					}
				);
		});
		this.currentStep = stepper._selectedIndex;
	}

	ngOnDestroy() {
		this.matchValidationDataSub.unsubscribe();
	}

	nextStep() {
		this.teamEventValidationService.onNextStep(this.currentStep, this.steps, (nextStep, currentStep) => {
			this.onStepSelectionEmitter(nextStep, currentStep, this.stepper);
		});
	}

	previousStep() {
		this.teamEventValidationService.onPreviousStep(this.currentStep, this.steps, (stepNum, step) => {
			this.onStepSelectionEmitter(stepNum, step, this.stepper);
		});
	}

	validateStep(isValid, stepNum) {
		this.stepValidation[stepNum] = isValid;
	}

	onStepChange(selectedStep) {
		const {currentStep, steps} = this.teamEventValidationService.onStepChange(selectedStep, this.steps)
		this.steps = steps;
		this.currentStep = currentStep;
	}
}
