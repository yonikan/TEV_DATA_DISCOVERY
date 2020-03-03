import { TeamEventValidationService } from 'src/app/team-event-validation/team-event-validation.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { MILLISECONDS_MINUTE, MIN_WARMUP_PHASE_DURATION_MINUTES, MIN_MATCH_PHASE_DURATION_MINUTES } from 'src/app/app.consts';
@Component({
  selector: 'phases-modal',
  templateUrl: './phases-modal.component.html',
  styleUrls: ['./phases-modal.component.scss']
})
export class PhasesModalComponent implements OnInit {

  modalOptions: any[]; // ModalOption[]
  phaseDurationTotal: string;
  phaseToEdit: any; // Phase
  durationError: string;
  subTypeError: string;

  constructor(private teamEventValidationService: TeamEventValidationService,public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { eventType: number, phasesCount: number, index: number, phase: any }) {
  }

  ngOnInit() {
    this.phaseToEdit = JSON.parse(JSON.stringify(this.data.phase));
    this.phaseToEdit['originalSubType'] = this.phaseToEdit.subType;
    this.setModalOptions();
  }

  setModalOptions(): void {
    if (this.data.eventType === 1) { // training
      this.modalOptions = [
        { name: 'Technical', icon: 'account_circle', type: 3 },
        { name: 'Physical', icon: 'account_circle', type: 1 },
      ]
    } else if (this.data.eventType === 2) { // match
      this.modalOptions = [
        { name: 'Match Phase', icon: 'account_circle', type: 5, subType: null },
        { name: 'Warmup', icon: 'account_circle', type: 5, subType: 7 },
      ]
    }
  }

  setPhaseDurationTotal(): string {
    const diff = this.getTimeDiff(this.phaseToEdit.endTime, this.phaseToEdit.startTime);
    this.phaseDurationTotal = `Total: ${diff} MIN`;
    return this.phaseDurationTotal;
  }

  getMatchPhaseNameById(id) {
    return this.teamEventValidationService.getMatchPhaseNameById(id);
  }

  onUpdateField({ value, filedPathToUpdate }: {value: any, filedPathToUpdate: string[]}): void {
    // filedPathToUpdate is set as array for hundling nested values inside phaseToEdit in the feuture;
    this.phaseToEdit[filedPathToUpdate[0]] = value;
    this.validateSubtype();
    this.validateDuration();
  }

  validateSubtype(): void {
    let errorMassage = '';

    // Can be a total of 6 match phases per game
    const matchPhaseCount = this.teamEventValidationService.getAllPhases().reduce((acc, phase) => {
      if (this.getMatchPhaseNameById(phase.subType) !== 'warmUp') { acc++ };
      return acc;
    }, 0);

    if (this.getMatchPhaseNameById(this.phaseToEdit.subType) !== 'warmUp' && matchPhaseCount > 6) {
      errorMassage += 'Can be a total of 6 match phases per game, ';
    }

    // phase subType is required for saving a phase;
    // if (!this.phaseToEdit.subType) {
    //   errorMassage += 'Phase type is required for saving a phase, ';
    // }

    this.subTypeError = errorMassage.substring(0, errorMassage.length - 2);
  }

  validateDuration(): void {
    const diff = this.getTimeDiff(this.phaseToEdit.endTime, this.phaseToEdit.startTime);
    let errorMassage = '';

    // phase duration is required for saving a phase;
    if (!this.phaseToEdit.startTime || !this.phaseToEdit.endTime) {
      errorMassage += 'phase duration is required for saving a phase, ';
    }

    // if subType === 7 => start time is first||last;
    if (this.getMatchPhaseNameById(this.phaseToEdit.subType) === 'warmUp' && (this.data.index === 1 || this.data.index === this.data.phasesCount)) {
      errorMassage += 'Warmup phase can only be the first or last phase of a match event, ';
    }

    // if subType === 7 => endTime - startTime >= 5min; ”warmup should be longer than 5 min”
    if (this.getMatchPhaseNameById(this.phaseToEdit.subType) === 'warmUp' && diff < MIN_WARMUP_PHASE_DURATION_MINUTES) {
      errorMassage += 'warmup should be longer than 5 min, ';
    }

    // check phase start and end time is in the event timeFrame;
    if (this.phaseToEdit.startTime < this.teamEventValidationService.getCurrentEventMetadata().startTime || this.phaseToEdit.endTime > this.teamEventValidationService.getCurrentEventMetadata().endTime) {
      errorMassage += 'Phase time should be in the event timeframe, ';
    }

    // if subType !== 7 => endTime - startTime >= 10min; "match phase should be longer than 10 min"
    if (this.getMatchPhaseNameById(this.phaseToEdit.subType) !== 'warmUp' && diff < MIN_MATCH_PHASE_DURATION_MINUTES) {
      errorMassage += 'match phase should be longer than 10 min, ';
    }

    // match phases can overlap in total of 1 min only; “Match phases cannot overlap”
    if (this.getMatchPhaseNameById(this.phaseToEdit.subType) !== 'warmUp' && this.teamEventValidationService.isPhaseOverlap(this.phaseToEdit, MILLISECONDS_MINUTE)) {
      errorMassage += 'Match phases cannot overlap, ';
    }

    this.durationError = errorMassage.substring(0, errorMassage.length - 2);
  }

  getTimeDiff(endTime: number, startTime: number): number {
    return Math.round((endTime - startTime) / MILLISECONDS_MINUTE)
  }

  savePhase(): void {
    // TODO: check restrictions before saving
    // TODO: replce phaseToEdit with original phase
    console.log('saving phase', this.phaseToEdit)
    this.close(this.phaseToEdit);
  }

  close(updatedPhase?: any): void { // Phase
    this.dialogRef.close(updatedPhase);
  }

  updateTime(timeStr: string, prop: string): void {
    const d = new Date(this.phaseToEdit[prop]);
    timeStr.split(':').map((v, i) => {
      if (i === 0) {
        return d.setHours(+v)
      }
      return d.setMinutes(+v)
    })

    this.onUpdateField({ value: d.getTime(), filedPathToUpdate: [prop] });
    this[prop] = d.getTime() // HACK: for change detection
  }

  isValidTime(time: number): boolean {
    const phases = this.teamEventValidationService.getAllPhases();
    return (time < phases[0].startTime || time > phases[phases.length - 1].endTime);
  }
}
