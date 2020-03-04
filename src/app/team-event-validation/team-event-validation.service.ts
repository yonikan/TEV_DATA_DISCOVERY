import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { UiComponentsService } from '../core/services/ui-components.service';
import { ServerEnvService } from '../core/services/server-env.service';
import { TEAM_EVENT_VALIDATION_MATCH_DATA } from 'server/data/team-event-validation-match.data';
import { StaticDataService } from '../core/services/static-data.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { objToArray } from '../core/helpers/helper-functions';
import { MILLISECONDS_MINUTE } from 'src/app/app.consts';

const moment = extendMoment(Moment);
@Injectable({
  providedIn: 'root'
})
export class TeamEventValidationService {
  trainingDataOutput = {
    step1GeneralData: null,
    step2PlayersData: null,
    step3PhasesData: null
  };
  matchDataOutput = {
    step1OverviewData: null,
    step2PlayersData: null,
    step3FormationsData: null,
    step4PhasesData: null,
    step5SubsData: null
  };
  private trainingValidationData: any;
  private trainingValidationDataListener = new BehaviorSubject<any>({});
  private matchValidationData: any;
  private matchValidationDataListener = new BehaviorSubject<any>({});
  private currentTeamEventType: number;

  BASE_URL;
  lineup = [];
  availableForSub = [];

  constructor(
    private http: HttpClient,
    private uiComponentsService: UiComponentsService,
    private serverEnvService: ServerEnvService,
    private staticDataService: StaticDataService,
  ) {
    this.BASE_URL = serverEnvService.getBaseUrl(3)
  }

  fetchTraining(trainingId): any {
    const PATH = this.serverEnvService.getBaseUrl();
    this.http.get<any>(`${PATH}/v3/training/${trainingId}`)
      .subscribe(
        (trainingResp: any) => {
          this.trainingValidationData = trainingResp;
          this.setTrainingValidationData(this.trainingValidationData);
        },
        (error) => {

        }
      );
  }

  validateTraining(trainingId) {
    const PATH = this.serverEnvService.getBaseUrl();
    const PAYLOAD = this.trainingValidationData;
    return this.http.post<any>(`${PATH}/v3/training/${trainingId}`, PAYLOAD);
  }

  fetchMatch(matchId): any {
    const PATH = this.serverEnvService.getBaseUrl();
    this.http.get<any>(`${PATH}/v3/match/${matchId}`)
      .subscribe(
        (matchResp: any) => {
          this.matchValidationData = matchResp;
          this.setMatchValidationData(this.matchValidationData);
          // this.setFormation();

        },
        (error) => {

        }
      );
  }

  validateMatch(matchId) {
    const PATH = this.serverEnvService.getBaseUrl();
    const PAYLOAD = this.matchValidationData;
    return this.http.post<any>(`${PATH}/v3/match/${matchId}`, PAYLOAD);
  }

  getCurrentTeamEventType(): number {
    this.currentTeamEventType = this.uiComponentsService.getIsSidepanelOpen().teamEventType;
    return this.currentTeamEventType;
  }

  getTrainingValidationData(): any {
    return this.trainingValidationData;
  }

  setTrainingValidationData(data: any) {
    this.trainingValidationData = data;
    this.trainingValidationDataListener.next(data);
  }

  getTrainingValidationDataListener(): Observable<any> {
    return this.trainingValidationDataListener.asObservable();
  }

  getMatchValidationData(): any {
    return this.matchValidationData;
  }

  setMatchValidationData(data: any) {
    this.matchValidationData = data;
    this.matchValidationDataListener.next(data);
  }

  getMatchValidationDataListener(): Observable<any> {
    return this.matchValidationDataListener.asObservable();
  }


  // Speed graph & participating players methods =========================================================================================
  get phasesVerticesData() {
    return of(TEAM_EVENT_VALIDATION_MATCH_DATA.metadata.velocityVector);
  }

  revertSwaps(teamEventId, onSuccess) {
    this.http.put(`${this.BASE_URL}/v3/team-event/${teamEventId}/revert-swaps`, {})
      .subscribe(onSuccess);
  }

  swapPlayer(srcId, swapId, teamEventId, onSuccess) {
    this.http.put(`${this.BASE_URL}/v3/team-event/${teamEventId}/swap`, { srcId, swapId })
      .subscribe(onSuccess);
  }

  getPlayersForSwap(subject: BehaviorSubject<any>, teamEventId) {
    this.http
      .get(`${this.BASE_URL}/v3/team-event/${teamEventId}/players-for-swap`)
      .subscribe((data: any) => {
        subject.next({
          clubPlayers: data.map(player => ({
            ...player,
            positionName: this.getPlayerPositionName(player.positionId, 'category')
          }))
        });
      })
  }

  getParticipatingPlayers(subject: BehaviorSubject<any>, teamEventId, type = 'training') {
    this.http
      .get(`${this.BASE_URL}/v3/${type}/${teamEventId}`)
      .subscribe((data: any) => {
        const players = Object.values(data.participatingPlayers).map(
          (p: any) => ({
            ...p,
            positionName: this.getPlayerPositionName(p.defaultPositionId, 'shortName')
          }));

        subject.next({ allPlayers: players });
      });
  }

  getPlayerPositionName(positionId, prop) {
    const playerPosition = this.staticDataService.getStaticData().positions[positionId];
    return playerPosition
      ? playerPosition[prop]
      : playerPosition['0'][prop]
  }


  // Phases & subs methods =========================================================================================
  getCurrentValitationData(): any {
    switch (this.getCurrentTeamEventType()) {
      case 1:
        return this.getTrainingValidationData();

      case 2:
        return this.getMatchValidationData();
    }
  }

  getCurrentEventMetadata(): any {
    return this.getCurrentValitationData().metadata || {};
  }

  getPlayerById(playerId: number): any {
    return this.getCurrentValitationData().participatingPlayers[playerId] || {};
  }

  getPlayersByIds(playerIds: number[], key?: string): any[] {
    return playerIds.map((playerId) => {
      return this.getPlayerById(key ? playerId[key] : playerId);
    })
  }

  getPositionById(positionId: number): any {
    return this.getStaticData().positions[positionId];
  }

  getAllParticipatingPlayers(): any {
    return this.getCurrentValitationData().participatingPlayers || {};
  }

  setFormation(): void {
    const participatingPlayers = this.getCurrentValitationData().participatingPlayers;
    this.lineup = this.getPlayersByIds(this.getCurrentValitationData().formation, 'playerId');

    this.availableForSub = Object.values(participatingPlayers).filter((player) => {
      return !this.isPlayerInLineup(player);
    });
  }

  isPlayerInLineup(player: any): boolean {
    return this.lineup.some((lineupPlayer) => {
      return lineupPlayer.id === player.id;
    });
  }

  isPhaseOverlap(phaseToCheck: any, overlapRange?: number): boolean {
    return this.getAllPhases().some((phase) => {
      return phaseToCheck.id !== phase.id && this.isTimeRangesOverlap(phaseToCheck, phase, overlapRange);
    });
  }

  isTimeRangesOverlap(timescope1: any, timescope2: any, overlapRange: number = 0): boolean { // npm install --save moment-range
    const start1: any = timescope1.startTime - overlapRange;
    const end1: any = timescope1.endTime + overlapRange;
    const range = moment.range(start1, end1);
    const range2 = moment.range(timescope2.startTime, timescope2.endTime);
    return range.overlaps(range2);
  }

  getStaticData(): any{
    return this.staticDataService.getStaticData()
  }

  getStaticPositionsList(): any[] {
    return objToArray(this.getStaticData().positions, 'id');
  }

  getStaticCompetitionsList(): any[] {
    return objToArray(this.getStaticData().competitions, 'id');
  }

  getStaticMatchPhasesList(): any[] {
    return objToArray(this.getStaticData().matchPhases, 'id');
  }

  getCompetitionNameById(id: number): string {
    const currentCompetition = this.getStaticData().competitions[id];
    if (currentCompetition) {
      return currentCompetition.name;
    }
  }

  getMatchPhaseNameById(id: number): string {
    const currentMatchPhase = this.getStaticData().matchPhases[id];
    if (currentMatchPhase) {
      return currentMatchPhase.name;
    }
  }

  getAllPhases(): any[] {
    return this.getCurrentValitationData().phases.phasesList || [];
  }

  getMatchDuraiton(): number {
    const matchDuraiton = this.getAllPhases().reduce((acc, phase) => {
      if (this.getMatchPhaseNameById(phase.subType) !== 'warmUp') {
        acc += (phase.endTime - phase.startTime) / MILLISECONDS_MINUTE;
      }
      return acc;
    }, 0);

    return parseInt(matchDuraiton);
  }

  checkIfAllSubsAreValid(): boolean {
    return this.getCurrentValitationData().substitutions.subList.every((sub) => {
      return !sub.errorMassage;
    });
  }

  swapPlayerIdInSubstitutions(inPlayerId: number, outPlayerId: number): void {
    this.getMatchValidationData().substitutions.subList = this.getMatchValidationData().substitutions.subList.map((substitution) => {
      if (outPlayerId === substitution.inPlayerId) { substitution.inPlayerId = inPlayerId };
      if (outPlayerId === substitution.outPlayerId) { substitution.outPlayerId = inPlayerId };
      return substitution;
    });
    this.setMatchValidationData(this.getMatchValidationData());
  }

  onStepSelection(stepNumber, step, stepper, validateCallback) {
    if (stepNumber) {
      step.isCompleted = true;
      stepper.selected.completed = true;
      if (stepNumber == -1) {
        step.isCompleted = false;
        stepper.selected.completed = false;
        stepper.previous();
      } else if (step.isLastStep) {
        validateCallback();
      } else {
        stepper.next();
      }
    }
  }

  onNextStep(currentStepNum, steps, callback) {
    const nextStep = currentStepNum + 1;
    const currentStep = steps[currentStepNum];
    if (steps[nextStep] || currentStep.isLastStep) {
      callback(nextStep, currentStep);
    }
  }

  onPreviousStep(currentStep, steps, callback) {
    const prevStep = currentStep - 1;
    if (steps[prevStep]) {
      callback(-1, steps[prevStep]);
    }
  }

  onStepChange(selectedStep, steps): { currentStep, steps } {
    steps = [...steps.map((step, i) => {
      if (i > selectedStep.selectedIndex) {
        step.isCompleted = false;
      }
      return step;
    })];
    return { currentStep: selectedStep.selectedIndex, steps };
  }
}
