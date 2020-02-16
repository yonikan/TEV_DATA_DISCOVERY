import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamEventValidationService } from '../team-event-validation.service';
import { UiComponentsService } from '../../core/services/ui-components.service';
import { TeamOverviewService } from '../../team-overview/team-overview.service';

@Component({
	selector: 'app-match-validation',
	templateUrl: './match-validation.component.html',
	styleUrls: ['./match-validation.component.scss']
})
export class MatchValidationComponent implements OnInit, OnDestroy {
	@Input() matchId: number;
	@ViewChild('stepper', null) stepper: ElementRef;
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
		{name: 'OVERVIEW', isCompleted: false, isLastStep: false},
		{name: 'PLAYERS', isCompleted: false, isLastStep: false},
		{name: 'FORMATIONS', isCompleted: false, isLastStep: false},
		{name: 'PHASES', isCompleted: false, isLastStep: false},
		{name: 'SUBS', isCompleted: false, isLastStep: true}
	];
	currentStep: any = 0;

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private teamOverviewService: TeamOverviewService,
		private uiComponentsService: UiComponentsService
	) { }

	ngOnInit() {
		this.teamEventValidationService.fetchMatch(this.matchId);
		this.matchValidationDataSub = this.teamEventValidationService
			.getMatchValidationDataListener()
			.subscribe((matchValidationData: any) => {
				const matchValidationDataCopy = JSON.parse(JSON.stringify(matchValidationData));
				this.isLoading = false;
				this.step1Data = matchValidationDataCopy.metadata;
				this.step2Data = matchValidationDataCopy.participatingPlayers;
				this.step3Data = { formation: matchValidationDataCopy.formation, participatingPlayers: matchValidationDataCopy.participatingPlayers };
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
}
