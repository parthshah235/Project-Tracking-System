import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { AngularFireDatabaseModule } from "@angular/fire/database";
//import { LoginComponent } from "../app/views/login/login.component";

// Instructions ---->
// Replace configPlaceholder with your firebase credentials
import {environment} from '../environments/environment';
import { SuperSecretComponent } from './super-secret/super-secret.component';
import { ProfileComponent} from "./profile/profile.component";
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { FacebookLoginProvider } from "angularx-social-login";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { BoardModalComponent } from './dashboard/board-modal/board-modal.component';
import { TaskComponent } from "./dashboard/task/task.component";
import { TaskDetailsComponent } from "./dashboard/task/task-details/task-details.component";
import { UploadTaskComponent } from "./upload-task/upload-task.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { ReportsComponent } from './reports/reports.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChartsComponent } from './charts/charts.component';
import {DatePipe} from '@angular/common';
import { NgDragDropModule } from 'ng-drag-drop';

@NgModule({
  declarations: [
    AppComponent, 
    SuperSecretComponent,
    LoginComponent,
    ProfileComponent,
    DashboardComponent,
    SignupComponent,
    BoardModalComponent,
    TaskComponent,
    TaskDetailsComponent,
    UploadTaskComponent,
    UploaderComponent,
    ReportsComponent,
    ChartsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    FormsModule,
    AngularFireDatabaseModule,
    SocialLoginModule,
    Ng2SearchPipeModule,
    NgDragDropModule
  ],
  providers: [AuthService,DatePipe//{
    //provide: AuthServiceConfig,
    //useFactory:provideConfig
//  }
],
  bootstrap: [AppComponent]
})
export class AppModule {}
