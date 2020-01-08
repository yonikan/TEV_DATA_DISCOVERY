import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipatingPlayersComponent } from './participating-players.component';
import { ParticipatingColumnComponent } from './participating-column/participating-column.component';
import { SwapPlayersComponent } from './swap-players/swap-players.component';
import { MatExpansionModule, MatListModule, MatDividerModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	declarations: [
	  ParticipatingPlayersComponent,
	  ParticipatingColumnComponent,
	  SwapPlayersComponent
	]
})
export class ParticipatingPlayersModule { }
