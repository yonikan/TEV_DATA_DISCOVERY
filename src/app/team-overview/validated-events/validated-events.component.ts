import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeInOutAnimation } from '../../core/animations/fade-in-out.animation';
import { EventsCarouselModalComponent } from '../events-carousel/events-carousel-modal/events-carousel-modal.component';
import { MatDialog } from '@angular/material';
import { UiComponentsService } from '../../core/services/ui-components.service';
import { ServerEnvService } from '../../core/services/server-env.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-validated-events',
  templateUrl: './validated-events.component.html',
  styleUrls: ['./validated-events.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ValidatedEventsComponent implements OnInit, OnDestroy {
  teamEvents;
  isTeamEventsLoading;
  index = 0;
  isLoading = true;
  getUserLoginDataListenerSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private serverEnvService: ServerEnvService,
    private uiComponentsService: UiComponentsService
  ) { }

  ngOnInit() {
	this.getUserLoginDataListenerSubscription = this.authService.getUserLoginDataListener().subscribe(data => {
		if (data.teams) {
			const TEAM_ID = data.teams[0].id;
			const BASE_URL = this.serverEnvService.getBaseUrl();
			const API_VERSION = 'v2';
			this.http
			.get<any>(`${BASE_URL}/${API_VERSION}/team/${TEAM_ID}/team-events`)
			.subscribe((result: any) => {
				// this.teamEvents = result; // only validated team-events
				this.teamEvents = result.splice(0, 20);
				this.isLoading = false;
				this.isTeamEventsLoading = false;
			}, (err) => {
				console.log('err: ', err);
			});
		}
	});
  }

  onEditSession(teamEvent) {
    this.uiComponentsService.setIsSidepanelOpen(
      {isOpen: true, teamEventType: teamEvent.teamEventType, teamEventId: teamEvent.teamEventId, isTeamEventValidationFinished: false}
    );
  }

  onDeleteSession(teamEvent) {
    let eventType;
    if(teamEvent.teamEventType === 1) {
      eventType = 'training';
    } else if(teamEvent.teamEventType === 2) {
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
      .subscribe(modalData => {
        if(modalData) {
          this.uiComponentsService.setIsLoading(true);
          const PATH = this.serverEnvService.getBaseUrl(1);
          this.http
            .delete<any>(`${PATH}/v1/team_event/${teamEvent.teamEventId}`)
            .subscribe((result: any) => {
              this.uiComponentsService.setIsLoading(false);
              const teamIndex = this.teamEvents.findIndex((teamEvent) => teamEvent.id === teamEvent.teamEventId );
              this.teamEvents.splice(teamIndex, 1);
            }, (err) => {
              console.log('err: ', err);
            });
        }
      });
  }

  onDownloadPdfReport(report) {
    console.log('report: ', report);
  }

  ngOnDestroy(): void {
	this.getUserLoginDataListenerSubscription.unsubscribe();
  }
}
