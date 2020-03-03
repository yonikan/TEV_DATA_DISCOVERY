import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TeamEventValidationService } from '../../team-event-validation.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';

const players = [
	{ id: 1, name: 'John A.', "positionName": "XX" },
	{ id: 2, name: 'John B.', "positionName": "XX" },
	{ id: 3, name: 'John C.', "positionName": "XX" },
	{ id: 4, name: 'John A.', "positionName": "XY" },
	{ id: 5, name: 'John B.', "positionName": "XY" },
	{ id: 6, name: 'John A.', "positionName": "XZ" },
	{ id: 7, name: 'John B.', "positionName": "XZ" },
];

@Component({
	selector: 'app-step-match-formations',
	templateUrl: './step-match-formations.component.html',
	styleUrls: ['./step-match-formations.component.scss']
})
export class StepMatchFormationsComponent implements OnInit, OnChanges {
	@Input() stepMatchFormationsData: any;
	@Input() positions = [];
	@Output() stepSelectionEmitter = new EventEmitter<number>();
	@Output() onValidate = new EventEmitter<boolean>();

	playersData: any = [];

	tactics = null;

	definedSubs = [
		{ id: 1, name: 'Match Minutes', isSelected: true },
		{ id: 2, name: 'Phase Minutes', isSelected: false }
	];

	selectedFormation = {};
	formationData: any = [];
	participatingPlayers:any = [];
	isValidated = true;

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private staticDataService: StaticDataService) {

	}


	ngOnInit() {
		this.tactics = this.staticDataService.getData('formations', 'team-event-validation');
	}

	ngOnChanges() {
		this.participatingPlayers = this.stepMatchFormationsData.participatingPlayers;
		this.formationData = this.stepMatchFormationsData.formation;
		if (this.positions) {
			this.playersData = Object.values(this.stepMatchFormationsData.participatingPlayers)
				.reduce((acc: any, val: any) => {
					if (!val.isParticipated) {
						return acc;
					}
					const position = this.positions[val.defaultPositionId];
					const categoryPlayers = acc.find(v => v.category === position.category);
					if (!categoryPlayers) {
						acc = [...acc, {category: position.category, players: [val]}];
					} else {
						categoryPlayers.players = [...categoryPlayers.players, val]
					}
					return acc
				}, []);
		}
	}

	selectTactic(tacticFormation) {
		this.selectedFormation = tacticFormation;
	}

	selectDefinedSub(id) {
		// console.log('selectDefinedSub', id);
	}

	nextStep() {
		this.teamEventValidationService.matchDataOutput.step3FormationsData = this.stepMatchFormationsData;
		this.stepSelectionEmitter.emit(3);
	}

	previousStep() {
		this.stepSelectionEmitter.emit(-1);
	}

	onFormationSelectionEmitter(data) {
		console.log('data: ', data);
	}

	onFormationFieldEmitter(formationFieldData) {
		const matchData = this.teamEventValidationService.getMatchValidationData();
		let matchDataCopy = {...matchData};
		matchDataCopy.formation = formationFieldData;
		this.teamEventValidationService.setMatchValidationData(matchDataCopy);
	}

	checkValidation(isValidated) {
		this.isValidated = isValidated;
		this.onValidate.emit(this.isValidated);
	}
}
