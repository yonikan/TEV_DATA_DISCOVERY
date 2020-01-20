import { Injectable } from '@angular/core';
import { TrainingValidation, MatchValidation } from './team-event-validation.model';
import { TEAM_EVENT_VALIDATION_TRAINING } from 'server/data/team-event-validation-training.data';
import { TEAM_EVENT_VALIDATION_MATCH } from 'server/data/team-event-validation-match.data';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamEventValidationService {
  trainingData: any = {
    step1GeneralData: {
      test1: 'this is a test'
    },
    step2PlayersData: {
      test1: 'this is a test'
    },
    step3PhasesData: {
      test1: 'this is a test'
    }
  };

  matchData: any = {
    step1OverviewData: {
      data: 'this is a test'
    },
    step2PlayersData: {
      data: {
        id: 1,
        firstName: 'test',
        lastName: 'test',
        defaultPositionId: 1,
        activeTime: {
           startTime: 1, endTime: 1
        },
        isParticipated: true,
        errorId: 1
      }
    },
    step3FormationsData: {
      data: 'this is a test'
    },
    step4PhasesData: {
      data: {
        id: 1,
        type: 1,
        name: 1,
        startTime: 1,
        endTime: 1,
        offset: 1,
        numberOfSubs: 1
      }
    },
    step5SubsData: {
      data: {
        id: 1,
        inPlayerId: 1,
        outPlayerId: 1,
        timeMin: 1
      }
    }
  };

  trainingDataOutput: any = {
    step1GeneralData: {

    },
    step2PlayersData: {

    },
    step3PhasesData: {

    }
  };

  matchDataOutput: any = {
    step1OverviewData: {

    },
    step2PlayersData: {

    },
    step3FormationsData: {

    },
    step4PhasesData: {

    },
    step5SubsData: {

    }
  };

  constructor(private http: HttpClient) { }

  getParticipatingPlayers(subject: Subject<any>) {
	this.http
		.get('https://footballrest2-dev.playermaker.co.uk/api/v3/training/49609')
		.subscribe((data: any) => {
			console.log('data', data);
			// HACK: remove tmp code
			const players = Object.values(data.participatingPlayers.playersList).map(
				(p: any) => ({...p, "avatarUrl": "https://s3.eu-west-2.amazonaws.com/playermaker-user-images/public/1573040414.jpg"}));

			return subject.next({allPlayers: players});
		});
  }

  getTrainingDataNewModel(): any {
    return of(TEAM_EVENT_VALIDATION_TRAINING);
  }

  getMatchDataNewModel(): any {
    return of(TEAM_EVENT_VALIDATION_MATCH);
  }

  getTrainingData(): any {
    return this.trainingData;
  }

  getMatchData(): any {
    return this.matchData;
  }

  validateTraining() {
    console.log('trainingDataOutput: ', this.trainingDataOutput);
  }

  validateMatch() {
    console.log('matchDataOutput: ', this.matchDataOutput);
  }
}

