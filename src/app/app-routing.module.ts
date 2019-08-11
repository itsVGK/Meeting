import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingViewComponent } from './meeting-view/meeting-view.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { AuthGuardService } from './service/auth-guard.service';
import { AdminResolverService } from './service/admin-resolver.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'meeting', component: MeetingViewComponent, canActivate: [AuthGuardService], resolve: { isAdmin: AdminResolverService } },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
