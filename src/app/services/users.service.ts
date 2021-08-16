import { AngularFireAuth } from "@angular/fire/auth";

export class Users {
    uid: string;
    displayName: string;

    constructor(auth){
        this.uid = auth.uid;
    }
}