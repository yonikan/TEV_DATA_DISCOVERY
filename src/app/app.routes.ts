import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthComponent } from './auth/auth/auth.component';
import { MenuComponent } from './core/components/menu/menu.component';
import { ValidatedEventsToastComponent } from './core/components/validated-events-toast/validated-events-toast.component';

const routes: Routes = [
  { path: 'team-overview', loadChildren: () => import('./team-overview/team-overview.module')
    .then(m => m.TeamOverviewModule), canLoad: [AuthGuard]},
  // { path: 'team-event-validation', loadChildren: () => import('./team-event-validation/team-event-validation.module')
  //   .then(m => m.TeamEventValidationModule), canLoad: [AuthGuard]},
  { path: 'toast', component: ValidatedEventsToastComponent },
  { path: 'login', component: AuthComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/team-overview', pathMatch: 'full' },
  { path: '**', redirectTo: '/team-overview', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
