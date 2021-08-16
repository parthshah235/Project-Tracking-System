import { Injectable, OnInit } from '@angular/core';
import { List } from "./board.model";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap,map } from 'rxjs/operators';
import { User } from "./user.model";
import { AuthService } from './auth.service';
import { promise } from 'protractor';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common'
@Injectable({
  providedIn: 'root'
})
export class BoardServiceService implements OnInit {
  list :Observable<List>;
  user$: Observable<any>;
  //list: Observable<any>;
  userId : string;
  constructor( private afAuth: AngularFireAuth,
    private afs: AngularFirestore,public authService:AuthService,private router: Router,public datepipe: DatePipe) { 
      this.afAuth.authState.subscribe(user$ =>{
        if(user$) this.userId = user$.uid;
        console.log(this.userId);
        localStorage.setItem('uid', this.userId);
      })
    }

    ngOnInit(){
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            console.log(user.uid);
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            //console.log(user.uid);
            //return this.db.object(`demo/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
      
    }

   getLists() {
     //return this.webReqService.get('lists');
     const uu = localStorage.getItem('uid');
     /*return this.afs.collection('boards').doc(uu)
     .collection('bfcQZIKMoUwRfHNIhbpx').get()
     .then(querySnapshot =>{
       querySnapshot.forEach(doc =>{
         console.log(doc.id,"=>",doc.data());
       });
     });*/
     return this.afs.collection("boards").doc(uu).collection("boardsDetails")
    .valueChanges();
   }

   getTask(){
    const uu = localStorage.getItem('uid');
    const bb = localStorage.getItem('bid');
    return this.afs.collection("boards").doc(uu).collection("boardsDetails")
    .doc(bb).collection("task")
    .valueChanges();
   }

   getUsersList(){
    return this.afs.collection("users")
    .valueChanges();
   }

  createList(title: string) { 
    // We want to send a web request to create a list
    //return this.webReqService.post('lists', { title });
    const userUid = localStorage.getItem('uid');
    const id = this.afs.createId();
    const userRef: AngularFirestoreDocument<List> = this.afs.doc(`boards/${userUid}/boardsDetails/${id}/`);
    const date = new Date();
    let latest_date =this.datepipe.transform(date, 'dd-MM-yyyy');

    const data = {
      id: id,
      title: title,
      created: latest_date
    };
    //this.customersRef.push(data);
    return userRef.set(data, { merge: true }); 
  }

  getNotification(){
    const userUid = localStorage.getItem('uid');
    return this.afs.collection("notification").doc(userUid).collection("myNotifications")
    .valueChanges();
   }

   getFiles(){
    const userUid = localStorage.getItem('uid');
    const boardid = localStorage.getItem('bid');
    const dTid = localStorage.getItem('dTaskId');
    return this.afs.collection("boards").doc(userUid).collection("boardsDetails").doc(boardid).collection("task")
    .doc(dTid).collection("taskAttachments")
    .valueChanges();
   }

}
