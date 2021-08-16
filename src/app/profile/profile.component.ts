import { Component, OnInit } from '@angular/core';
import { BoardServiceService } from "../services/board-service.service";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  n;
  notifications = [];
  constructor(private router:Router,public auth: AuthService ,
      private boardService: BoardServiceService,private afs: AngularFirestore) { }

  ngOnInit(): void {
    return this.getNotifiacation();
  }

  onProfile(){
    this.router.navigate(['/profile']);
  }
  onHome(){
    this.router.navigate(['/dashboard']);
  }
  onNew(){
    this.router.navigate(['/task-details']);
  }

  backToDashboard(){
    this.router.navigate(['/dashboard']);
  }
  getNotifiacation(){
    const userUid = localStorage.getItem('uid');
    this.boardService.getNotification().subscribe(val => this.n=val);
    this.afs.collection("notification").doc(userUid)
    .collection("myNotifications").snapshotChanges()
    .subscribe(tID => {
      this.notifications=[];
      tID.forEach(a => {
        let taskIds:any = a.payload.doc.data();
        taskIds.id = a.payload.doc.id;
        this.notifications.push(taskIds);
        //console.log(taskIds);
      })
    });
  }

}
