import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
export class StepMatchFormationsComponent implements OnInit {
	@Input() stepMatchFormationsData: any;
	@Output() stepSelectionEmitter = new EventEmitter<number>();

	playersData: any = [];

	tactics = null;

	definedSubs = [
		{ id: 1, name: 'Match Minutes', isSelected: true },
		{ id: 2, name: 'Phase Minutes', isSelected: false }
	];

	selectedFormation = {};
	positions: any;
	formationData: any = [];
	participatingPlayers:any = [];

	constructor(
		private teamEventValidationService: TeamEventValidationService,
		private staticDataService: StaticDataService) {

	}


	ngOnInit() {
		this.participatingPlayers = this.stepMatchFormationsData.participatingPlayers;
		this.formationData = this.stepMatchFormationsData.formation;
		this.positions = this.staticDataService.getStaticData().positions;
		this.playersData = Object.values(this.stepMatchFormationsData.participatingPlayers)
		.reduce((acc: any, val: any) => {
			const position = this.positions[val.defaultPositionId];
			const categoryPlayers = acc.find(v => v.category === position.category);
			if (!categoryPlayers) {
				acc = [...acc, {category: position.category, players: [val]}];
			} else {
				categoryPlayers.players = [...categoryPlayers.players, val]
			}
			return acc
		}, []);
		this.staticDataService.getData('formations').subscribe(data => {
			this.tactics = data;
		})
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
}
