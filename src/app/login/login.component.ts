import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  error='';
  return = '';

  constructor(private router: Router,
              public authService:AuthService,
              private _firebaseAuth: AngularFireAuth) { }
  ngOnInit(): void {
    const isLogin = sessionStorage.getItem("login");
    if(isLogin == "true")
    {
      this.router.navigate(['/dashboard']);
    }
    else if (isLogin == "false")
    {
      this.router.navigate(['/login']);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }

  onReg(){
    this.router.navigate(['/signup']);
  }
  signInWithGoogle() {
    this.authService.googleSignin()
    .then((res) => { 
        this.router.navigate(['/dashboard'])
      })
    .catch((err) => console.log(err));
  }

  signInWithFacebook() {
      this.authService.FacebookAuth()
      .then((res) => { 
          this.router.navigate(['dashboard'])
        })
      .catch((err) => console.log(err));
    }

  onRegister(){
    this.router.navigate(['/signup']);
  }

  onSubmit(authForm)
  {
  if (authForm.valid)
   {
    this._firebaseAuth.auth.signInWithEmailAndPassword(authForm.value.email, authForm.value.password)
    .then(
       (success) => {
          this.router.navigate(['/dashboard']);
       }).catch(
          (err) => {
             //this.snack.show();
             this.error = err;
       });
   }
 }
 
}
