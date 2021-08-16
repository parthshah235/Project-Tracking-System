import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from "../services/user.model";
import { List } from "../services/board.model";
import { BoardServiceService } from "../services/board-service.service";
import * as admin from "firebase-admin";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user$: Observable<any>;
  
  userId : string;
  lists;
  boardIds = [];
  selectedListId: string;
  newTempObject: any = {}
  userName : string;

  searchValue: string = "";
  results: any;
  searchText;

  n;
  notifications = [];
  constructor(private router: Router,
    public authService: AuthService,
    private boardService: BoardServiceService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    
    ) {
      this.afAuth.authState.subscribe(user$ =>{
        if(user$) 
        this.userId = user$.uid;
        this.userName = user$.displayName;
        console.log(this.userId);
        localStorage.setItem('uid', this.userId);
        localStorage.setItem('uname',this.userName);
      });

      const uu = localStorage.getItem('uid');
      //console.log(uu);

  }

  ngOnInit() {
    //this.boardService.getLists().then((lists: List[]) => {
    // this.lists = lists;
    //})
                  const uu = localStorage.getItem('uid');
                  console.log(uu);
    
    this.boardService.getLists().subscribe(val => this.lists=val);
    this.afs.collection("boards").doc(uu).collection("boardsDetails").snapshotChanges()
    .subscribe(bID => {
      this.boardIds=[];
      bID.forEach(a => {
        let boardIds:any = a.payload.doc.data();
        boardIds.id = a.payload.doc.id;
        this.boardIds.push(boardIds);
        console.log(boardIds);
      })
    })

    return this.getNotifiacation();
  }
  onProfile() {
    this.router.navigate(['/profile']);
  }
  onHome() {
    this.router.navigate(['/dashboard']);
  }

  onDelete(list){
    const b = localStorage.getItem('b');
  if(confirm('Do you want to delete this Board?'))
  {
    const uu = localStorage.getItem('uid');
                  console.log(uu);
    this.afs.doc(`boards/${uu}/boardsDetails/${list.id}`).delete();
  }
  }
  createList(title: string) {  
    this.boardService.createList(title).then(res => {
      console.log(res);
      // Now we navigate to /lists/task._id
      //this.router.navigate([ '/lists', list._id ]); 
    });
  }

  update1(i){
    this.newTempObject = this.lists[i];
    localStorage.setItem('b',this.newTempObject.id);
    console.log('newObject dash: ' ,this.newTempObject);

  }

  onSubmit(form: NgForm){
    const t = form.value.boardTitle;
    console.log('id title:',t);
    //const t = title;
    const uu = localStorage.getItem('uid');
    const b = localStorage.getItem('b')
    
    this.afs.doc(`boards/${uu}/boardsDetails/${b}`).update({
      title:  t,
    });
  }

  navigateURL(list){
    localStorage.setItem('bid', list.id);
    localStorage.setItem('bName', list.title);
    this.router.navigate(['/task']);
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
