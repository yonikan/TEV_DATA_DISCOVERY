import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamEventValidationService } from '../team-event-validation.service';
import { UiComponentsService } from '../../core/services/ui-components.service';
import { TeamOverviewService } from '../../team-overview/team-overview.service';

@Component({
	selector: 'app-training-validation',
	templateUrl: './training-validation.component.html',
	styleUrls: ['./training-validation.component.scss']
})
export class TrainingValidationComponent implements OnInit, OnDestroy {
	@Input() trainingId: number;
	@ViewChild('stepper', { static: false }) stepper: ElementRef;

	currentSelectedStep = 0;
	isLoading = true;
	step1Data: any;
	step2Data: any;
	step3Data: any;
	trainingValidationData: any;
	private trainingValidationDataSub: Subscription;
	currentStep: any = 0;
	steps = [
		{name: 'GENERAL', isCompleted: false, isLastStep: false, id: 0},
		{name: 'PLAYERS', isCompleted: false, isLastStep: false, id: 1},
		{name: 'PHASES', isCompleted: false, isLastStep: true, id: 2}
	];
	isValid: boolean;
	stepValidation = {
		0: true,
		1: true,
		2: true
	};
	isLoadingTest = true;

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private teamOverviewService: TeamOverviewService,
		private uiComponentsService: UiComponentsService,
	) { }

	ngOnInit() {
		console.log('onINIT!');
		this.teamEventValidationService.initPlayerErrorsStaticData();
		this.teamEventValidationService.fetchTraining(this.trainingId);
		this.trainingValidationDataSub = this.teamEventValidationService
			.getTrainingValidationDataListener()
			.subscribe((trainingValidationData: any) => {
				const trainingValidationDataCopy = JSON.parse(JSON.stringify(trainingValidationData));
				if(!this.teamEventValidationService.getTrainingValidationData()) {
					this.teamEventValidationService.setTrainingValidationData(trainingValidationDataCopy);
				}
				this.isLoading = false;
				this.step1Data = trainingValidationDataCopy.metadata;
				this.step2Data = trainingValidationDataCopy.participatingPlayers;
				this.step3Data = { ...trainingValidationDataCopy.phases, ...trainingValidationDataCopy.metadata };
			});
		setTimeout(() => {
			this.isLoadingTest = false;
		}, 800);
	}

	onStepSelectionEmitter(stepNumber, step, stepper) {
		this.teamEventValidationService.onStepSelection(stepNumber, step, stepper, () => {
			this.isLoading = true;
			this.teamEventValidationService.validateMatch(this.trainingId)
				.subscribe(
					(matchResp: any) => {
						this.isLoading = false;
						this.uiComponentsService.setIsSidepanelOpen(
							{ isOpen: false, teamEventType: null, teamEventId: null, isTeamEventValidationFinished: true }
						);
					},
					(error) => {
						this.teamOverviewService.setTeamEventAfterValidation(this.trainingId);
						this.isLoading = false;
						this.uiComponentsService.setIsSidepanelOpen(
							{ isOpen: false, teamEventType: null, teamEventId: null, isTeamEventValidationFinished: false }
						);
					}
				);
		});
		this.currentStep = stepper._selectedIndex;
	}

	onStepSelectionEmitter1(stepNumber) {
		this.currentSelectedStep = stepNumber;
		if (stepNumber === 3) {
			this.isLoading = true;
			this.teamEventValidationService.validateTraining(this.trainingId)
				.subscribe(
					(trainingResp: any) => {
						this.isLoading = false;
						this.uiComponentsService.setIsSidepanelOpen(
							{ isOpen: false, teamEventType: null, teamEventId: null, isTeamEventValidationFinished: true }
						);
					},
					(error) => {
						this.teamOverviewService.setTeamEventAfterValidation(this.trainingId);
						this.isLoading = false;
						this.uiComponentsService.setIsSidepanelOpen(
							{ isOpen: false, teamEventType: null, teamEventId: null, isTeamEventValidationFinished: false }
						);
					}
				);
		}
	}

	ngOnDestroy() {
		this.trainingValidationDataSub.unsubscribe();
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

	onStepChange(selectedStep) {
		const {currentStep, steps} = this.teamEventValidationService.onStepChange(selectedStep, this.steps)
		this.steps = steps;
		this.currentStep = currentStep;
	}
}
