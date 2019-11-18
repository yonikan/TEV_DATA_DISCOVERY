import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeamPickerService } from '../core/team-picker/team-picker.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  pageName = 'training';
  private currentTeamUpdateSub: Subscription;
  isLoading = true;;

  constructor(public teamPickerService: TeamPickerService) { }

  ngOnInit() {
    this.isLoading = true;

    this.currentTeamUpdateSub = this.teamPickerService
      .getCurrentTeamUpdateListener()
      .subscribe(currentTeam => {
        // console.log('TRAININGS - currentTeam: ', currentTeam);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.currentTeamUpdateSub.unsubscribe();
  }
}
