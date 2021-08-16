import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { BoardServiceService } from "../../services/board-service.service";
import { Task } from "../../services/task.model";
import { NgForm } from '@angular/forms';
import { snapshotChanges } from '@angular/fire/database';
import * as $ from "jquery";
import { NgDragDropModule } from 'ng-drag-drop';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  @Input() TaskName;
  @Input() TaskDesc;
  @Input() TaskDuedate;
  @Input() TaskPriority;
  @Input() TaskMembers;
  @Input() TaskDue;

  lists;
  taskIds = [];
  usersList = [];
  temp = [];
  tempID;
  demo = [];
  boardLists;
  newTempObject: any = {}
  n;
  notifications = [];
  mem = [];
  tMem;
  files;
  fileIds = [];
  searchText;
  projectName: string;
  dateError : string;
  d : string;
  todayDate= (new Date(), 'dd-MM-yyyy');
  error:any={isError:false,errorMessage:''};
  form : NgForm;
  constructor(private router:Router,
    public authService:AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private boardService: BoardServiceService,
    ) { 
      this.projectName = localStorage.getItem('bName');
      this.boardService.getUsersList().subscribe(val => this.lists=val);
    this.afs.collection("users").snapshotChanges()
    .subscribe(userD => {
      this.usersList=[];
      userD.forEach(a => {
        let usersList:any = a.payload.doc.data();
        usersList.id = a.payload.doc.id;
        this.usersList.push(usersList);
        //console.log(usersList.displayName);
      })
    });
    this.boardService.getLists().subscribe(val => this.boardLists=val);
   // console.log(this.lists);
    const uu = localStorage.getItem('uid');
                  console.log('userId',uu);
    this.afs.collection("boards").doc(uu).collection('boardsDetails').snapshotChanges()
    .subscribe(boardD =>{
      this.boardLists;
      boardD.forEach(b =>{
        let lists:any = b .payload.doc.data();
        this.lists.id = b.payload.doc.id;
        this.lists.push(lists);
        //console.log('blist',lists);
      })
    });
    }

  ngOnInit(): void {
    
    const uu = localStorage.getItem('uid');
                  console.log(uu);
    const bb = localStorage.getItem('bid');
                  console.log(bb);

    this.boardService.getTask().subscribe(val => this.lists=val);
    this.afs.collection("boards").doc(uu).collection("boardsDetails")
    .doc(bb).collection("task").snapshotChanges()
    .subscribe(tID => {
      this.taskIds=[];
      tID.forEach(a => {
        let taskIds:any = a.payload.doc.data();
        taskIds.id = a.payload.doc.id;
        this.taskIds.push(taskIds);
        //console.log(taskIds);
      })
    });

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

  compareTwoDates(){
    console.log("inBlur");
    if(new Date(this.TaskDue) < new Date()){
      console.log("error")
       
      alert("Due Date cant be less than current date");
      this.error={isError:true,errorMessage:"Due Date cant be less than current date"}
    }
    else
    {
      this.error={isError:true,errorMessage:" "};
    }
 }

  onSubmit(form: NgForm) {

    /*Insertion of task*/ 

    const tName = form.value.taskName;
    const tDesc = form.value.taskDesc;
    const tDD = form.value.taskDueDate;
    const tPrio = form.value.taskPriority;
    const tMember = form.value.taskMembers;
    //console.log(tName);
    //console.log(tDesc);
    //console.log(tDD);
    //console.log(tPrio);
    console.log(tMember);
    const uu = localStorage.getItem('uid');
    const bb = localStorage.getItem('bid');
    const id = this.afs.createId();
    const taskRef: AngularFirestoreDocument<any> = 
    this.afs.doc(`boards/${uu}/boardsDetails/${bb}/task/${id}`);
    
    const data = {
      taskId: id,
      taskName :  tName,
      taskDesc: tDesc,
      taskDueDate: tDD,
      taskPriority: tPrio,
      taskMembers:tMember,
      taskStatus: 0
    };

    localStorage.setItem('tid', id);

    taskRef.set(data, { merge: true });

    const tId = localStorage.getItem('tid');

    /* Insertion of Board details in member */

    if(uu == tMember){
    const bName = localStorage.getItem('bName');
    console.log(bName,bb);
    const boardRef: AngularFirestoreDocument<any> = 
    this.afs.doc(`boards/${tMember}/boardsDetails/${bb}`);
    console.log(boardRef);
    const boardData = {
      id: bb,
      title: bName,
    };
    console.log(boardData);
    boardRef.set(boardData, { merge: true });
    
  }
  else{
    const bName = localStorage.getItem('bName');
    console.log(bName,bb);
    const boardRef: AngularFirestoreDocument<any> = 
    this.afs.doc(`boards/${tMember}/boardsDetails/${bb}`);
    console.log(boardRef);
    const boardData = {
      id: bb,
      title: bName,
      boardStatus: 0
    };
    console.log(boardData);
    boardRef.set(boardData, { merge: true });
  }
  
    /* Insertion of Task Details in member */
    const un = localStorage.getItem('uname');
    const assigned = uu;
    localStorage.setItem("assigned",assigned);
    
    if(uu === tMember){
    const taskRef1: AngularFirestoreDocument<any> = 
    this.afs.doc(`boards/${tMember}/boardsDetails/${bb}/task/${tId}`);
    const data1 = {
      taskId: id,
      taskName :  tName,
      taskDesc: tDesc,
      taskDueDate: tDD,
      taskPriority: tPrio,
      taskMembers:tMember,
      taskStatus: 0,
      assignedBy: assigned,
      taskStatusM: 1
    };
    taskRef1.set(data1, { merge: true });
    localStorage.setItem('member',tMember);
  }

  else{
    const taskRef1: AngularFirestoreDocument<any> = 
    this.afs.doc(`boards/${tMember}/boardsDetails/${bb}/task/${tId}`);
    const data1 = {
      taskId: id,
      taskName :  tName,
      taskDesc: tDesc,
      taskDueDate: tDD,
      taskPriority: tPrio,
      taskMembers:tMember,
      taskStatus: 0,
      assignedBy: assigned,
      taskStatusM: 0
    };
    taskRef1.set(data1, { merge: true });
    localStorage.setItem('member',tMember);
  }
    const iD = this.afs.createId();

    /* Insertion of notifications */
    if(uu != tMember){
    const bName = localStorage.getItem('bName');
    const na = localStorage.getItem('uname');
    const notifiacation: AngularFirestoreDocument<any> = 
    this.afs.doc(`notification/${tMember}/myNotifications/${iD}`);
    const notifica = {
      
      taskName :  tName,
      taskStatus: 0,
      boardTitle: bName,
      assignedBy: na,
      msg: "has assigned you a task"
    };

    notifiacation.set(notifica, { merge: true });
    this.closebutton.nativeElement.click();
    //this.router.navigate(['/uploader']);
  }
  form.reset();
}

  onSelectList(aa: string){
    console.log(aa);
    let obj = this.boardLists.filter((t) => t.id === aa);  
    //this.boardLists = obj;  
    console.log(obj); 
    localStorage.setItem('bid', aa);
    this.router.navigateByUrl('dashboard', { skipLocationChange: true }).then(() => {
      this.router.navigate(['task']);
  }); 
    //this.router.navigate(['/task/id',aa]);

  }

   curDate()
   {
     const GivenDate = '04-05-2020';
     const CurrentDate = new Date();
     console.log(CurrentDate);
     const GivenDate1 = new Date(GivenDate);  
     console.log(GivenDate1);

     if (GivenDate1 < CurrentDate) {
       alert('The selected time is less than 30 days from now');
     }
     else {
       alert('Given date is perfect');
     }
   }
  

  taskDetails(i){
    //console.log('i : ', this.lists[i]);



    this.newTempObject = this.lists[i];
    console.log('newObject: ' ,this.newTempObject);
    localStorage.setItem('dTaskId', this.newTempObject.taskId)
    localStorage.setItem('dMemId', this.newTempObject.taskMembers)
    localStorage.setItem('assignId', this.newTempObject.assignedBy)
    // localStorage.setItem('tempId',list.taskId)
    // this.tempID = localStorage.getItem('tempId');
    // console.log("in");
    // console.log(list.taskId);
    // this.temp.push(list);
    // console.log(this.temp);

    let inf = this.afs.collection('users').ref.where('uid', '==', this.newTempObject.taskMembers);
    inf.get().then((result) => {
      result.forEach(doc => {
        this.tMem = doc.data();
        this.mem.push(this.tMem);
      })
    })
    this.mem.splice(0,1);

    const uu = localStorage.getItem('uid');
    const boardid = localStorage.getItem('bid');
    const dTid = localStorage.getItem('dTaskId');
    this.boardService.getFiles().subscribe(val => this.files=val);
    this.afs.collection("boards").doc(uu).collection("boardsDetails").doc(boardid).collection("task")
    .doc(dTid).collection("taskAttachments").snapshotChanges()
    .subscribe(bID => {
      this.fileIds=[];
      bID.forEach(a => {
        let fileIds:any = a.payload.doc.data();
        fileIds.id = a.payload.doc.id;
        this.fileIds.push(fileIds);
        console.log(fileIds);
      })
    })

  }

  updateTask(){
    /*const name = this.newTempObject.taskName; 
    const desc = this.newTempObject.taskDesc;
    const dueDate = this.newTempObject.taskDueDate;
    const priority = this.newTempObject.taskPriority;*/
    //const mem = this.newTempObject.taskName;
    const id = this.newTempObject.taskId;
    

    const uu = localStorage.getItem('uid');
    const bb = localStorage.getItem('bid');

    const tnm = this.TaskName;
    const tDes = this.TaskDesc;
    const tDue = this.TaskDuedate;
    const tPriority = this.TaskPriority;
    const memberTask = localStorage.getItem("dMemId");
    console.log("update",memberTask);

    const CurrentDate = new Date();
     console.log(CurrentDate);
     const GivenDate1 = new Date(tDue);  
     console.log(GivenDate1);

     if (GivenDate1 < CurrentDate) {

       this.dateError = "Date Is Overdue"
     }
     else {
       this.dateError = " ";
     }


    const upd = {
      taskName :  tnm,
      taskDesc : tDes,
      taskDueDate: tDue,
      taskPriority: tPriority
    };
    
    this.afs.doc(`boards/${uu}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${memberTask}/boardsDetails/${bb}/task/${id}`).update(upd);
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

  inProgress(){
    const id = this.newTempObject.taskId;
    const m = this.newTempObject.taskMembers;
    const uu = localStorage.getItem('uid');
    const bb = localStorage.getItem('bid');
    const assignedby = localStorage.getItem("assignId");
 
    const upd = {
      taskStatus: 1
    };

    
    this.afs.doc(`boards/${uu}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${m}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${assignedby}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.closebutton.nativeElement.click();
    
  }

  QA(){
    const id = this.newTempObject.taskId;
    const m = this.newTempObject.taskMembers;
    const uu = localStorage.getItem('uid');
    const bb = localStorage.getItem('bid');
    const assignedby = localStorage.getItem("assignId");
    const upd = {
      taskStatus: 2
    };

    this.afs.doc(`boards/${uu}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${m}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${assignedby}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.closebutton.nativeElement.click();
  }

  closed(){
    const id = this.newTempObject.taskId;
    const m = this.newTempObject.taskMembers;
    const uu = localStorage.getItem('uid');
    const bb = localStorage.getItem('bid');
    const assignedby = localStorage.getItem("assignId");

    const upd = {
      taskStatus: 3
    };

    this.afs.doc(`boards/${uu}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${m}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.afs.doc(`boards/${assignedby}/boardsDetails/${bb}/task/${id}`).update(upd);
    this.closebutton.nativeElement.click();
  }

  delete(i){
    this.newTempObject = this.lists[i];
    
    const mem = this.newTempObject.taskMembers;
    const uu = localStorage.getItem('uid');
                  console.log("delete",uu);
                  const bb = localStorage.getItem('bid');
    if(confirm('Do you want to delete this Board?'))
    {
    this.afs.doc(`boards/${uu}/boardsDetails/${bb}/task/${this.newTempObject.taskId}`).delete();
    }
    this.afs.doc(`boards/${mem}/boardsDetails/${bb}/task/${this.newTempObject.taskId}`).delete();
  }

  

}