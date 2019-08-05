import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingViewComponent } from './meeting-view/meeting-view.component';


const routes: Routes = [
  {path:'meeting', component:MeetingViewComponent},
  {path:'', redirectTo:'meeting', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
