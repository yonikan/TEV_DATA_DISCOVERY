import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { enumToString } from '../../../core/helpers/helper-functions';
import { teamEvents } from '../../../core/enums/team-events.enum';
import * as moment from 'moment';
import { ValidatedEventsService } from '../../validated-events/validated-events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() eventIndex: number;
  @Input() eventData: any;
  @Output() confirmSessionEmitter = new EventEmitter<any>();
  @Output() convertSessionEmitter = new EventEmitter<any>();
  @Output() editSessionEmitter = new EventEmitter<any>();
  @Output() deleteSessionEmitter = new EventEmitter<string>();
  @Output() downloadPdfReportEmitter = new EventEmitter<any>();
  isValidated = false;
  teamEventTypeString;
  startTimeHoursFormatted;
  endTimeHoursFormatted;
  durationTimeAgo;
  duration;
  isPdfReportLoading = false;
  cardTitle: string;

  constructor(private validatedEventsService: ValidatedEventsService) { }

  ngOnInit() {
    this.eventData.startTime = moment(this.eventData.startTime);
    this.eventData.endTime = moment(this.eventData.endTime);
    this.eventData.trimStartTime = moment(this.eventData.trimStartTime);
    this.eventData.trimEndTime = moment(this.eventData.trimEndTime);
    this.eventData.phaseMinStartTime = moment(this.eventData.phaseMinStartTime);
    this.eventData.phaseMaxEndTime = moment(this.eventData.phaseMaxEndTime);

    let offset = 0;
    if (this.eventData.offset) {
      offset = this.eventData.offset;
    }

    this.eventData.startTime = this.eventData.startTime.add(offset, 'hours');
    this.eventData.endTime = this.eventData.endTime.add(offset, 'hours');
    this.eventData.trimStartTime = this.eventData.trimStartTime.add(offset, 'hours');
    this.eventData.trimEndTime = this.eventData.trimEndTime.add(offset, 'hours');
    this.eventData.phaseMinStartTime = this.eventData.phaseMinStartTime.add(offset, 'hours');
    this.eventData.phaseMaxEndTime = this.eventData.phaseMaxEndTime.add(offset, 'hours');


    // formatted time ===============================================
    let start;
    let end;
    if(this.eventData.type === 1) {
      if (this.eventData.trimStartTime){
        start = moment(this.eventData.trimStartTime);
        end = moment(this.eventData.trimEndTime);
      } else {
        start = moment(this.eventData.startTime);
        end = moment(this.eventData.endTime);
      }
    } else if(this.eventData.type === 2) {
      if (this.eventData.phaseMinStartTime){
        start = moment(this.eventData.phaseMinStartTime);
        end = moment(this.eventData.phaseMaxEndTime);
      } else {
        start = moment(this.eventData.startTime);
        end = moment(this.eventData.endTime);
      }
    } else {
      start = moment(this.eventData.startTime);
      end = moment(this.eventData.endTime);
    }

    // duration ===============================================
    let duration;
    const startForDuration = moment(this.eventData.startTime);
    const endForDuration = moment(this.eventData.endTime);

    if(this.eventData.duration){
      duration = Math.abs(this.eventData.duration);
    } else {
      duration = Math.abs(startForDuration.diff(endForDuration, 'minutes'));
    }
    this.duration = Math.floor(duration);


    // team event date ===============================================
    let teamEventStartTime;
    let teamEventStartEnd;
    if(this.eventData.type === 1) {
      if (this.eventData.trimStartTime){
        teamEventStartTime = this.eventData.trimStartTime;
        teamEventStartEnd = this.eventData.trimEndTime;
      } else {
        teamEventStartTime = this.eventData.startTime;
        teamEventStartEnd = this.eventData.endTime;
      }
    } else if(this.eventData.type === 2) {
      if (this.eventData.phaseMinStartTime){
        teamEventStartTime = this.eventData.phaseMinStartTime;
        teamEventStartEnd = this.eventData.phaseMaxEndTime;
      } else {
        teamEventStartTime = this.eventData.startTime;
        teamEventStartEnd = this.eventData.endTime;
      }
    } else {
      teamEventStartTime = this.eventData.startTime;
      teamEventStartEnd = this.eventData.endTime;
    }

    let teamEventDate = moment(teamEventStartTime);
    this.durationTimeAgo = teamEventDate.format('ddd, MMM Do YYYY');

    let startHours = new Date(teamEventStartTime).toISOString().substring(11, 13);
    let startMinutes = new Date(teamEventStartTime).toISOString().substring(14, 16);
    let endHours = new Date(teamEventStartEnd).toISOString().substring(11, 13);
    let endMinutes = new Date(teamEventStartEnd).toISOString().substring(14, 16);
    this.startTimeHoursFormatted = `${startHours}:${startMinutes}`;
    this.endTimeHoursFormatted = `${endHours}:${endMinutes}`;

    // let teamEventDate = moment(this.eventData.startTime);
    // this.durationTimeAgo = teamEventDate.format('dddd, MMMM Do YYYY');
    // let startHours = new Date(this.eventData.startTime).toISOString().substring(11, 13);
    // let startMinutes = new Date(this.eventData.startTime).toISOString().substring(14, 16);
    // let endHours = new Date(this.eventData.endTime).toISOString().substring(11, 13);
    // let endMinutes = new Date(this.eventData.endTime).toISOString().substring(14, 16);
    // this.startTimeHoursFormatted = `${startHours}:${startMinutes}`;
    // this.endTimeHoursFormatted = `${endHours}:${endMinutes}`;


    // card title ===============================================
    this.teamEventTypeString = enumToString(teamEvents, this.eventData.type);

    if(this.eventData.isValidated) {
      if(this.eventData.type === 1) {
        if(this.eventData.eventTags) {
          this.cardTitle = this.eventData.eventTags[0];
        } else {
          this.cardTitle = `Training Session`;
        }
      } else if(this.eventData.type === 2) {
        if(this.eventData.opponentName) {
          this.cardTitle = `Vs. ${this.eventData.opponentName}`;
        } else {
          this.cardTitle = `Match`;
        }
      }
    } else {
       this.cardTitle = `new ${this.teamEventTypeString}`;
    }
  }

  confirmSession() {
    const event = {
      teamEventId: this.eventData.id,
      teamEventType: this.eventData.type
    };
    this.confirmSessionEmitter.emit(event);
  }

  convertSession(eventId) {
    const event = {
      teamEventId: this.eventData.id,
      teamEventType: this.eventData.type
    };
    this.convertSessionEmitter.emit(event);
  }

  editSession() {
    const event = {
      teamEventId: this.eventData.id,
      teamEventType: this.eventData.type
    };
    this.editSessionEmitter.emit(event);
  }

  deleteSession(eventId) {
    this.deleteSessionEmitter.emit(eventId);

    // const event = {
    //   teamEventId: this.eventData.id,
    //   teamEventType: this.eventData.type
    // };

    // this.deleteSessionEmitter.emit(event);
  }

  downloadPdfReport(reportType) {
    // this.isPdfReportLoading = true;
    // const report = {
    //   teamEventId: this.eventData.id,
    //   teamEventType: reportType
    // };
    // this.downloadPdfReportEmitter.emit(report);

    this.validatedEventsService.getTeamEventPdfReport(this.eventData.id, reportType);

  }
}
