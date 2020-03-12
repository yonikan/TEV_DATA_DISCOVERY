import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { EventsCarouselModalComponent } from './events-carousel-modal/events-carousel-modal.component';
import { fadeInOutAnimation } from '../../core/animations/fade-in-out.animation';
import { ServerEnvService } from '../../core/services/server-env.service';
import { Subscription } from 'rxjs';
import { UiComponentsService } from '../../core/services/ui-components.service';
import { Router } from '@angular/router';
import { enumToString } from '../../core/helpers/helper-functions';
import { TeamEvents } from '../../core/enums/team-events.enum';
import { AuthService } from '../../auth/auth.service';
import { TeamOverviewService } from '../team-overview.service';
import {ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app-events-carousel',
	templateUrl: './events-carousel.component.html',
	styleUrls: ['./events-carousel.component.scss'],
	animations: [fadeInOutAnimation]
})
export class EventsCarouselComponent implements OnInit, OnDestroy {
	isTeamEventsLoading = true;
	teamEvents = [];
	index = 0;
	teamEventAfterValidation: any;
	private teamEventAfterValidationSub: Subscription;
	private getUserLoginDataListenerSubscription: Subscription;
	config: SwiperConfigInterface = {
		direction: 'horizontal',
		keyboard: true,
		grabCursor: true,
		observer: true,
		spaceBetween: 30,
		slidesPerView: 5.2,
		breakpoints: {
			1025: {
				slidesPerView: 1.2
			},
			1441: {
				slidesPerView: 2.2
			},
			1921: {
				slidesPerView: 3.2
			},
			2300: {
				slidesPerView: 4.2
			}
		}
	};

	constructor(
		private http: HttpClient,
		private authService: AuthService,
		private serverEnvService: ServerEnvService,
		private uiComponentsService: UiComponentsService,
		private router: Router,
		private teamOverviewService: TeamOverviewService,
		private dialog: MatDialog,
		private cdref: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.getUserLoginDataListenerSubscription = this.authService.getUserLoginDataListener().subscribe(data => {
			if (data.teams) {
				const [team] = data.teams;
				if (team) {
					const TEAM_ID = team.id;
					const BASE_URL = this.serverEnvService.getBaseUrl();
					const API_VERSION = 'v2';
					this.http
						.get<any>(`${BASE_URL}/${API_VERSION}/team/${TEAM_ID}/team-events/unvalidated`)
						.subscribe((result: any) => {
							this.teamEvents = result;
							this.isTeamEventsLoading = false;
						}, (err) => {
							console.log('err: ', err);
						});
				}
			}

		});



		this.teamEventAfterValidationSub = this.teamOverviewService
			.getTeamEventAfterValidationListener()
			.subscribe((teamEventId: any) => {
				console.log('teamEventId: ', teamEventId);
				const teamIndex = this.teamEvents.findIndex((teamEvent) => teamEvent.id === teamEventId);
				this.teamEvents.splice(teamIndex, 1);
			});
	}

	onConfirmSession(teamEvent) {
		this.uiComponentsService.setIsSidepanelOpen(
			{ isOpen: true, teamEventType: teamEvent.teamEventType, teamEventId: teamEvent.teamEventId, isTeamEventValidationFinished: false }
		);
	}

	onConvertSession(teamEvent) {
		const teamEventEnumString = enumToString(TeamEvents, teamEvent.teamEventType);
		const modalTitle = `Convert ${teamEventEnumString}`;
		const modalMessage = `Are you sure you want to convert the ${teamEventEnumString}?`;
		const dialogRef = this.dialog.open(EventsCarouselModalComponent, {
			width: '500px',
			height: '200px',
			data: {
				title: modalTitle,
				message: modalMessage,
				modalData: teamEvent
			}
		});
		dialogRef.afterClosed()
			.subscribe(teamEventId => {
				if (teamEventId) {
					this.uiComponentsService.setIsLoading(true);
					let changeToEventType: number;
					if (teamEvent.teamEventType === 1) {
						changeToEventType = 2;
					} else if (teamEvent.teamEventType === 2) {
						changeToEventType = 1;
					}
					const PATH = this.serverEnvService.getBaseUrl(1);
					const PAYLOAD = {
						type: changeToEventType
					};
					this.http
						.put<any>(`${PATH}/v1/team_event/${teamEvent.teamEventId}`, PAYLOAD)
						.subscribe((result: any) => {
							this.uiComponentsService.setIsLoading(false);
						}, (err) => {
							this.uiComponentsService.setIsLoading(false);
						});
				}
			});
	}

	onDeleteSession(teamEvent) {
		let eventType;
		if (teamEvent.teamEventType === 1) {
			eventType = 'training';
		} else if (teamEvent.teamEventType === 2) {
			eventType = 'match';
		};
		const modalTitle = `delete ${eventType}`;
		const modalMessage = `Are you sure you want to delete the ${eventType}?`;
		const dialogRef = this.dialog.open(EventsCarouselModalComponent, {
			width: '500px',
			height: '200px',
			data: {
				title: modalTitle,
				message: modalMessage,
				modalData: teamEvent.teamEventId
			}
		});
		dialogRef.afterClosed()
			.subscribe(teamEventId => {
				if (teamEventId) {
					this.uiComponentsService.setIsLoading(true);
					const PATH = this.serverEnvService.getBaseUrl(1);
					this.http
						.delete<any>(`${PATH}/v1/team_event/${teamEvent.teamEventId}`)
						.subscribe((result: any) => {
							this.uiComponentsService.setIsLoading(false);
							const teamIndex = this.teamEvents.findIndex((teamEvent) => teamEvent.id === teamEvent.teamEventId);
							this.teamEvents.splice(teamIndex, 1);
						}, (err) => {
							this.uiComponentsService.setIsLoading(false);
						});
				}
			});
	}

	ngOnDestroy() {
		this.teamEventAfterValidationSub.unsubscribe();
		this.getUserLoginDataListenerSubscription.unsubscribe();
	}

	ngAfterContentChecked() {
		this.cdref.detectChanges();
	}
}
