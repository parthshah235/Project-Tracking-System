import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList } from "@angular/fire/database";
import { User } from "../services/user.model";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private dbPath = '/User';
  userRef: AngularFireList<User> = null;
  constructor(private db:AngularFireDatabase) {
    this.userRef = db.list(this.dbPath);
   }
   createUser(user:User){
     this.userRef.push(user); 
   }
}
