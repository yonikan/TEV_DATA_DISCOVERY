import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamEventValidationService } from '../../team-event-validation.service';
import { ContactSupportModalComponent } from 'src/app/shared/contact-support-modal/contact-support-modal.component';
import { ParticipatingPlayersService } from './participating-players.service';
import { AuthService } from 'src/app/auth/auth.service';

interface InitialState {
	excludedPlayers: Array<Object>;
	includedPlayers: Array<Object>;
	allPlayers: Array<Object>;
	clubPlayers: Array<Object>;
}

@Component({
	selector: 'app-participating-players',
	templateUrl: './participating-players.component.html',
	styleUrls: ['./participating-players.component.scss']
})
export class ParticipatingPlayersComponent implements OnInit {
	@Input() teamEventId: any;
	@Input() type = 'training';
	@Input() playerTimeframeErrors = [];
	@Output() participatingPlayersEmitter = new EventEmitter<any>();
	@ViewChild('swapPlayersPanel', { static: false }) _swapPlayersPanel: ElementRef;

	private state: InitialState = {
		excludedPlayers: [],
		includedPlayers: [],
		allPlayers: [],
		clubPlayers: []
	}
	private store;
	allPlayers: any = [];
	clubPlayers: any = [];
	private excludedPlayers = [];
	private includedPlayers = [];
	private initialState: any = {
		includedPlayersInit: [],
		excludedPlayersInit: [],
		allPlayers: [],
		clubPlayers: []
	};
	activePlayers = 0;
	clubPlayersGroup: any[];
	currentPlayer;
	isIncluded;
	isResetAllowed = false;
	userId;
	team: any = {};

	constructor(
		private participatingPlayersService: ParticipatingPlayersService,
		private dialog: MatDialog,
		private teamEventValidationService: TeamEventValidationService,
		private authService: AuthService) {
	}

	ngOnInit() {
		[this.team] = this.authService.getUserLoginData().teams;
		this.store = this.participatingPlayersService.getStore();
		this.participatingPlayersService.getState().subscribe(data => {
			const {allPlayers, clubPlayers} = data;
			if (allPlayers) {
				if (this.allPlayers.length === 0) {
					// save init state
					this.initialState.allPlayers = allPlayers.map(p => ({...p}));
				}
				this.activePlayers = allPlayers.filter((player: any) => player.isParticipated).length;
				this.allPlayers = allPlayers.map((player: any) => {
					const err = player.activeTime.find(activeTime => activeTime.timeFrameType !== 'active');
					if (err) {
						player.isParticipated = false;
						if (this.playerTimeframeErrors) {
							player.error = this.playerTimeframeErrors[player.activeTime[0].timeFrameType];
						}
					}
					return {...player};
				});
				this.sendToTeamEvent(this.allPlayers);
			}
			if (clubPlayers) {
				this.clubPlayers = clubPlayers;
				this.clubPlayersGroup = this.getClubPlayers();
			}
		});
	}

	doExcludePlayer(player) {
		this.isResetAllowed = true;
		this.store.next({
			excludedPlayers: [],
			includedPlayers: [],
			clubPlayers: this.clubPlayers,
			allPlayers: this.allPlayers.map(p => {
				if (p.id === player.id) {
					p.isParticipated = false;
				}
				return p;
			})
		});
	}
	doIncludePlayer(player) {
		this.isResetAllowed = true;
		this.store.next({
			excludedPlayers: [],
			includedPlayers: [],
			clubPlayers: this.clubPlayers,
			allPlayers: this.allPlayers.map(p => {
				if (p.id === player.id) {
					p.isParticipated = true;
				}
				return p;
			})
		});
	}

	doSwapPlayer(player, isIncluded) {
		this.teamEventValidationService.swapPlayer(this.currentPlayer.id, player.userId, this.teamEventId, () => {
			const newState = {
				allPlayers: this.allPlayers.map(p => {
					if (p.id === this.currentPlayer.id) {
						p = {
							...this.currentPlayer,
							isOpen: false,
							isSwapped: true,
							id: player.userId,
							firstName: player.firstName,
							lastName: player.lastName,
							profilePic: player.profilePic
						}
					}

					return p;
				}),
				clubPlayers: this.clubPlayers.map(cp => {
					if (cp.userId === player.userId) {
						cp.isParticipated = true;
					}
					return cp;
				})
			};

			this.isResetAllowed = true;
			this.store.next(newState);
			this.sendToTeamEvent(newState.allPlayers);
		});
	}

	mapSwap(player, swappedPlayer, players) {
		return players.map(p => {
			if (p.id === swappedPlayer.id) {
				p.isParticipated = false;
			}
			if (p.id === player.id) {
				p.isParticipated = p.isSwapped = true;
			}
			return p;
		});
	}

	doResetChanges(e, isIncluded) {
		// TODO: API
		this.teamEventValidationService.revertSwaps(this.teamEventId, () => {
			const newState = {
				excludedPlayers: this.excludedPlayers,
				includedPlayers: this.includedPlayers,
				allPlayers: [...this.initialState.allPlayers],
				clubPlayers: [...this.initialState.clubPlayers]
			};

			this.isResetAllowed = false;
			this.store.next(newState);
			this.sendToTeamEvent(newState.allPlayers);
		});

	}

	filterDuplicated(players, playersOrigin) {
		return playersOrigin.filter(p => {
			if (players.includes(includedPlayer => includedPlayer.id === p.id)) {
				return false;
			}
			return true;
		})
	}

	openDialog() {
		const dialogRef = this.dialog.open(ContactSupportModalComponent, {
			width: '415px',
			height: '426px'
		});

		dialogRef.afterClosed()
			.subscribe(result => {
				console.log('The dialog was closed', result);
			});
	}

	openSwapPlayersPanel({el, player, isIncluded}) {
		this.isIncluded = isIncluded;
		this.currentPlayer = player;
		this.scrollTo(el);
	}

	scrollTo(el: HTMLElement) {
		setTimeout(() => {
			el.appendChild(this._swapPlayersPanel.nativeElement)
			el.scrollIntoView({behavior:"smooth", block: "nearest"});
		}, 500);
	}

	getGrouped(arr, groupProp, subGroupName) {
		const group = arr.reduce((acc, curr) => {
			if (!acc[curr[groupProp]]) acc[curr[groupProp]] = [];
			 acc[curr[groupProp]] = [...acc[curr[groupProp]], {...curr}];
			return acc;
		}, {});

		return Object
			.keys(group)
			.map(name => ({name, teamId: this.team.id, [subGroupName]: group[name]}));
	}

	getClubPlayers() {
		const clubPlayersGroup = this.getGrouped(this.clubPlayers, 'teamName', 'players');
		return clubPlayersGroup.map((cpg: any) => {
			cpg.players = cpg.players.map((player: any) => {
				player.isParticipated = this.allPlayers.some(p => {
					return p.id === player.userId && p.isParticipated
				})
				return player;
			});
			cpg.players = this.getGrouped(cpg.players, 'positionName', 'players');
			return cpg;
		});
	}

	sendToTeamEvent(data) {
		this.participatingPlayersEmitter.emit(data.reduce((acc, val) => {
			acc[val.id] = val;
			return acc;
		}, {}));
	}
}
