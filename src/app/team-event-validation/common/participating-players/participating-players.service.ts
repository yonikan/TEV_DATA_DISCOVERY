import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, of, Observable } from 'rxjs';
import { TeamEventValidationService } from '../../team-event-validation.service';
import { distinctUntilChanged } from 'rxjs/operators';

interface InitialState {
	allPlayers: Array<Object>;
	clubPlayers: Array<Object>;
}

@Injectable({
	providedIn: 'root'
})
export class ParticipatingPlayersService implements OnDestroy {
	private state: InitialState = {
		allPlayers: [],
		clubPlayers: []
	}
	private store = new BehaviorSubject<InitialState>(this.state);
	private stateData = new BehaviorSubject<InitialState>(this.state);

	constructor(private teamEventValidationService: TeamEventValidationService) {
		this.store.subscribe(({allPlayers, clubPlayers}) => {
			if (allPlayers) {
				this.state.allPlayers = allPlayers.map(p => ({...p}));
			}

			if (clubPlayers) {
				this.state.clubPlayers = clubPlayers.map(p => ({...p}));
			}
			this.stateData.next(this.state);
		})
	}

	getData(eventId, type) {
		this.teamEventValidationService.getParticipatingPlayers(this.store, eventId, type);
		this.teamEventValidationService.getPlayersForSwap(this.store, eventId);
	}

	getStore(): BehaviorSubject<InitialState> {
		return this.store;
	}

	getState(): Observable<InitialState> {
		return this.stateData;
	}

	clearState() {
		this.stateData.next({allPlayers: [], clubPlayers: []});
	}

	ngOnDestroy() {
		this.store.unsubscribe();
	}

}
