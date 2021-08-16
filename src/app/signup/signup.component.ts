import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, NgForm } from '@angular/forms';
import { User } from "../services/user.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { UserService } from "../services/user.service";
import { auth } from 'firebase';
import { AngularFirestore,AngularFirestoreDocument } from "@angular/fire/firestore";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = new User(); 
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  error ='';

  constructor(private router: Router,
              private authService:AuthService,
              private _firbaseAuth: AngularFireAuth,
              private userService: UserService,
              private afs:AngularFirestore) { }

  ngOnInit(): void {
  }

  onlogin(){
    this.router.navigate(['/login']);
  }
  /*newUser(){
    this.user = new User();
  }*/

  save(user,dName){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data = {
     uid: user.uid,
     email: user.email,
     displayName: dName,
     photoURL: user.photoURL
   };

   return userRef.set(data, { merge: true });
  }
  
  onSubmit(form: NgForm)
  {  
    const dName = form.value.displayName;
  if (form.valid)
   {
    this._firbaseAuth.auth.createUserWithEmailAndPassword(form.value.email, form.value.password)
    .then(
       (success) => {
          this.save(success.user,dName);
          this.router.navigate(['/dashboard']);
       }).catch(
          (err) => {
             this.error = err;
       }); 
   }
 }
}
