import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { tap, map, switchMap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
//import { switchMap } from 'rxjs/operators';
import { User } from './user.model';
import * as firebase from 'firebase/app'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;
  t = "true";
  f = "false";
  
  uid = this.afAuth.authState.pipe(
    map(authState => {
      if(!authState){
        return null;
      } else {
        return authState.uid;
      }
      
    })
  );

  
  public key = this.uid;
  
  private dbPath = '/demo/';
  customersRef: AngularFireList<User> = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private db : AngularFireDatabase
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          //console.log(user.uid);
          //return this.db.object(`demo/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.customersRef = this.db.list(this.dbPath);
  }

  
  

/*getUser()
{
  return this.afAuth.authState.pipe(first()).toPromise();
}*/
  
getAuth() { 
  return this.afAuth.auth; 
} 

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    sessionStorage.setItem("login",this.t);
    return this.updateUserData(credential.user);
  }

  async FacebookAuth()
  {
    //return this.AuthLogin(new auth.FacebookAuthProvider());
    const pro = new auth.FacebookAuthProvider();
    const cred = await this.afAuth.auth.signInWithPopup(pro);
    sessionStorage.setItem("login",this.t);
    return this.updateUserData(cred.user);
  }  

  // Auth logic to run auth providers
  AuthLogin(provider) {
    const cred = this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
      console.log('You are successfully logged in!')
      //return this.updateUserData(credential.user);
    }).catch((error) => {
        console.log(error)
    })
  }

  async signOut() {
    sessionStorage.setItem("login", this.f);
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const id = this.afs.createId();
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    //this.customersRef.push(data);
    return userRef.set(data, { merge: true });
  }

}

