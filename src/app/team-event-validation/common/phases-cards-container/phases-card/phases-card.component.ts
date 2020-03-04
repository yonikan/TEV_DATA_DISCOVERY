import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AreYouSureModalComponent } from '../../../common/are-you-sure-modal/are-you-sure-modal.component';
import { MatDialog } from '@angular/material';
import { PhasesModalComponent } from '../../../common/phases-modal/phases-modal.component';
// import moment = require('moment');
import * as moment from 'moment';
import { enumToString } from '../../../../core/helpers/helper-functions';
import { TrainingDrills } from '../../../../core/enums/training-drills.enum'
import { TeamEventValidationService } from 'src/app/team-event-validation/team-event-validation.service';

@Component({
  selector: 'app-phases-card',
  templateUrl: './phases-card.component.html',
  styleUrls: ['./phases-card.component.scss']
})
export class PhasesCardComponent implements OnInit {

  @Input() phase;
  @Input() phasesCount;
  @Input() index;
  @Output() deleteCard = new EventEmitter();
  @Output() savePhaseChanges = new EventEmitter();

  mode = 'MATCH';

  ellipsisOptions = [
    // { name: 'Duplicate', icon: 'account_circle' },
    { name: 'Delete', icon: 'account_circle', action: 'onDeleteCard' }
  ];


  constructor(private dialog: MatDialog, private teamEventValidationService: TeamEventValidationService) { }

  ngOnInit() {
    // console.log(this.phase)
  }

  translatePhaseName(phaseSubTypeId) {
    return this.teamEventValidationService.getStaticMatchPhasesList()[phaseSubTypeId].name;
  }

  getTimeByFormat(startTime, endTime, offset?) {
    const diff = moment(endTime).diff(startTime, 'minutes');
    startTime = moment(startTime).add(offset, 'hours').format('hh:mm');
    endTime = moment(endTime).add(offset, 'hours').format('hh:mm');
    return `${startTime} - ${endTime} (${diff} min) - phase ${this.index + 1}/${this.phasesCount}`
  }

  hundleEllipsisAction(ellipsisOption) {
    this[ellipsisOption.action]();
  }

  onDeleteCard() {
    const modalTitle = 'Delete Phase';
    const modalMessage = `Are you sure you want to delete ${this.phase.name} phase?`;
    const dialogRef = this.dialog.open(AreYouSureModalComponent, {
      width: '500px',
      height: '200px',
      data: {
        title: modalTitle,
        message: modalMessage,
        modalData: this.phase.name
      }
    });

    dialogRef.afterClosed()
      .subscribe(isUserSure => {
        if (isUserSure) {
          this.deleteCard.emit(this.phase.id);
        }
      });
  }

  phaseClicked() {

    const dialogRef = this.dialog.open(PhasesModalComponent, {
      width: '870px',
      height: '290px',
      data: {
        eventType: this.teamEventValidationService.getCurrentTeamEventType(),
        phasesCount: this.phasesCount,
        index: this.index,
        phase: this.phase
      }
    });

    dialogRef.afterClosed()
      .subscribe(updatedPhase => {
        console.log(updatedPhase)
        if (updatedPhase) {
          this.savePhaseChanges.emit(updatedPhase);
        }
      });
  }

}
