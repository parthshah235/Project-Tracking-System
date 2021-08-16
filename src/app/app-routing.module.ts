import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperSecretComponent } from './super-secret/super-secret.component';
import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { BoardModalComponent } from './dashboard/board-modal/board-modal.component';
import { TaskComponent } from "./dashboard/task/task.component";
import { TaskDetailsComponent } from "./dashboard/task/task-details/task-details.component";
import { UploaderComponent } from './uploader/uploader.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { ReportsComponent } from "./reports/reports.component";
import { ChartsComponent } from "./charts/charts.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  
  { path: 'task', component: TaskComponent, canActivate: [AuthGuard] },
  
  { path: 'uploader', component: UploaderComponent, canActivate: [AuthGuard] },
  { path: 'uploadTask', component: UploadTaskComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'charts', component: ChartsComponent, canActivate: [AuthGuard] },
  { path: 'secret', component: SuperSecretComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
