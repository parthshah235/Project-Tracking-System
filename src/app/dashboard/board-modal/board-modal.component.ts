import { Component, OnInit, OnDestroy } from '@angular/core';
import { List } from "../../services/board.model";
import { BoardServiceService } from "../../services/board-service.service";
import { Subscription } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.css']
})
export class BoardModalComponent implements OnInit{
    subscription: Subscription
  
  constructor(private router: Router,private boardService: BoardServiceService,public afAuth:AngularFireAuth,public authService:AuthService) { }

  ngOnInit(){
  }

  createList(title: string) {
    
    this.boardService.createList(title).then(res => {
      console.log(res);
      // Now we navigate to /lists/task._id
      //this.router.navigate([ '/lists', list._id ]); 
       
    });
        
  }
  bd(){
    this.router.navigate([ '/dashboard']);
  }
}
