import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
// import { routes } from './team-event-validation.routes';

import { HighchartsChartModule } from 'highcharts-angular';
import { SwiperModule, SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
import { MatchValidationComponent } from './match-validation/match-validation.component';
import { TrainingValidationComponent } from './training-validation/training-validation.component';

import { StepTrainingGeneralComponent } from './training-validation/step-training-general/step-training-general.component';
import { StepTrainingPlayersComponent } from './training-validation/step-training-players/step-training-players.component';
import { StepTrainingPhasesComponent } from './training-validation/step-training-phases/step-training-phases.component';

import { StepMatchOverviewComponent } from './match-validation/step-match-overview/step-match-overview.component';
import { StepMatchPlayersComponent } from './match-validation/step-match-players/step-match-players.component';
import { StepMatchFormationsComponent } from './match-validation/step-match-formations/step-match-formations.component';
import { StepMatchPhasesComponent } from './match-validation/step-match-phases/step-match-phases.component';
import { StepMatchSubsComponent } from './match-validation/step-match-subs/step-match-subs.component';
import { TagsComponent } from './common/tags/tags.component';
import { SpeedGraphComponent } from './common/speed-graph/speed-graph.component';
import { TrainingDurationComponent } from './training-validation/step-training-general/training-duration/training-duration.component';
import { MatchOverviewComponent } from './match-validation/step-match-overview/match-overview/match-overview.component';
import { PhasesCardsContainerComponent } from './common/phases-cards-container/phases-cards-container.component';
import { PhasesCardComponent } from './common/phases-cards-container/phases-card/phases-card.component';
import { SubstitutionsTableComponent } from './common/substitutions-table/substitutions-table.component';
import { SubstitutionsRowComponent } from './common/substitutions-table/substitutions-row/substitutions-row.component';
import { AreYouSureModalComponent } from './common/are-you-sure-modal/are-you-sure-modal.component';
import { PhasesModalComponent } from './common/phases-modal/phases-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParticipatingPlayersComponent } from './common/participating-players/participating-players.component';
import { ParticipatingColumnComponent } from './common/participating-players/participating-column/participating-column.component';
import { SwapPlayersComponent } from './common/participating-players/swap-players/swap-players.component';
import { ContactSupportModalComponent } from '../shared/contact-support-modal/contact-support-modal.component';
import { GetTimePipe } from './common/participating-players/participating-column/get-time.pipe';
import { TimeDiffPipe } from './common/participating-players/participating-column/time-diff.pipe';
import { FormationFieldComponent } from './match-validation/step-match-formations/formation-field/formation-field.component';
import { FormationSelectionComponent } from './match-validation/step-match-formations/formation-selection/formation-selection.component';
import { FieldPlayerComponent } from './match-validation/step-match-formations/field-player/field-player.component';

import { MatchPhaseModalComponent } from './common/phases-modal/match-phase-modal/match-phase-modal.component';
import { PhysicalModalComponent } from './common/phases-modal/physical-modal/physical-modal.component';
import { WarmupModalComponent } from './common/phases-modal/warmup-modal/warmup-modal.component';
import { TechnicalModalComponent } from './common/phases-modal/technical-modal/technical-modal.component';
import { PitchSizeOptionComponent } from './common/pitch-size-option/pitch-size-option.component';
import { LineupDropdownRowComponent } from './common/phases-modal/technical-modal/lineup-dropdown-row/lineup-dropdown-row.component'
import { SimpleTimePickerComponent } from './common/simple-time-picker/simple-time-picker.component';
import { MatStepperModule } from '@angular/material';
import { ConvertedDatePipe } from './common/convertedDate.pipe';
@NgModule({
  declarations: [
    MatchValidationComponent,
    TrainingValidationComponent,
    StepTrainingGeneralComponent,
    StepTrainingPlayersComponent,
    StepTrainingPhasesComponent,
    StepMatchOverviewComponent,
    StepMatchPlayersComponent,
    StepMatchFormationsComponent,
    StepMatchPhasesComponent,
    StepMatchSubsComponent,
    TagsComponent,
    SpeedGraphComponent,
    TrainingDurationComponent,
    MatchOverviewComponent,
    PhasesCardsContainerComponent,
    PhasesCardComponent,
    SubstitutionsTableComponent,
    SubstitutionsRowComponent,
    AreYouSureModalComponent,
    PhasesModalComponent,
    MatchPhaseModalComponent,
    PhysicalModalComponent,
    WarmupModalComponent,
    TechnicalModalComponent,
    PitchSizeOptionComponent,
    LineupDropdownRowComponent,
    ParticipatingPlayersComponent,
    ParticipatingColumnComponent,
    SwapPlayersComponent,
    ContactSupportModalComponent,
    GetTimePipe,
    TimeDiffPipe,
    FormationFieldComponent,
    FormationSelectionComponent,
	FieldPlayerComponent,
	SimpleTimePickerComponent,
	ConvertedDatePipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    // CoreModule,
    // RouterModule.forChild(routes),
    HighchartsChartModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
	SwiperModule,
	MatStepperModule
  ],
  providers: [
    ConvertedDatePipe,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  exports: [
    MatchValidationComponent,
    TrainingValidationComponent,
    StepTrainingGeneralComponent,
    StepTrainingPlayersComponent,
    StepTrainingPhasesComponent,
    StepMatchOverviewComponent,
    StepMatchPlayersComponent,
    StepMatchFormationsComponent,
    StepMatchPhasesComponent,
    StepMatchSubsComponent,
    TagsComponent,
    SpeedGraphComponent,
    TrainingDurationComponent,
    MatchOverviewComponent,
	ParticipatingPlayersComponent,
	SimpleTimePickerComponent
  ],
  entryComponents: [
    AreYouSureModalComponent,
    PhasesModalComponent,
    ContactSupportModalComponent
  ],
})
export class TeamEventValidationModule { }
