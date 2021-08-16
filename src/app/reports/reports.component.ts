import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { BoardServiceService } from "../services/board-service.service";
//import * as jspdf from 'jspdf';  
//import html2canvas from 'html2canvas';  
import * as html2pdf from 'html2pdf.js'
import * as Chart from 'chart.js'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  //@ViewChild('content') content: ElementRef;
  
  n;
  notifications = [];
  boardLists;
  lists;
  taskIds = [];
  mem = [];
  tMem;
  projectName: string;
  searchText;
  td;
  taskDead = [];
  dd;
  constructor(private router:Router,
    public authService:AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private boardService: BoardServiceService,
    public datepipe: DatePipe) { 

      this.projectName = localStorage.getItem('bName');
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

  ngOnInit(){
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
        //console.log(taskIds.taskMembers);
      })

    });
    this.getMemberName();
    this.taskDeadline();
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

  onSelectList(aa: string){
    //console.log(aa);
    let obj = this.boardLists.filter((t) => t.id === aa);  
    //this.boardLists = obj;  
    console.log(obj); 
    localStorage.setItem('bid', aa);
    this.router.navigateByUrl('task', { skipLocationChange: true }).then(() => {
      this.router.navigate(['reports']);
  }); 
    //this.router.navigate(['/task/id',aa]);

  }

  getMemberName(){

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
        //console.log(taskIds.taskMembers);
        //taskIds.taskMembers
        
        let inf = this.afs.collection('users').ref.where('uid', '==', taskIds.taskMembers);
        inf.get().then((result) => {
        result.forEach(doc => {
        this.tMem = doc.data();
        this.mem.push(this.tMem);
        //console.log("members incomming",this.mem)
          })
        })

        
        
      })
    });

    /*let inf = this.afs.collection('users').ref.where('uid', '==', this.lists.taskMembers);
    inf.get().then((result) => {
      result.forEach(doc => {
        this.tMem = doc.data();
        this.mem.push(this.tMem);
      })
    })*/
  }

  taskDeadline(){
    const uu = localStorage.getItem('uid');
                  //console.log(uu);
    const bb = localStorage.getItem('bid');
                  //console.log(bb);

    this.boardService.getTask().subscribe(val => this.dd=val);
    this.afs.collection("boards").doc(uu).collection("boardsDetails")
    .doc(bb).collection("task").snapshotChanges()
    .subscribe(tID => {
      this.taskIds=[];
      tID.forEach(a => {
        let taskIds:any = a.payload.doc.data();
        taskIds.id = a.payload.doc.id;
        this.taskIds.push(taskIds);
        //console.log(taskIds.taskDueDate);
        //taskIds.taskMembers
        
        //this.taskDead.splice(0,1);
      })

        const date = new Date();
        let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd');
        
        let inf = this.afs.collection("boards").doc(uu).collection("boardsDetails")
        .doc(bb).collection("task").ref.where('taskDueDate', '<', latest_date);
        
        inf.get().then((result) => {
        result.forEach(doc => {
        let tD = doc.data();
        this.taskDead.push(tD);
        console.log("deadline",this.taskDead)
        //console.log(this.td.taskDueDate);
        
          })
          //this.taskDead.splice(0,1);
        })

    });
  }

  /*
  captureScreen()  
  {  
    var data = document.getElementById('contentToConvert');
html2canvas(data).then(canvas => {
// Few necessary setting options
var imgWidth = 208;
var pageHeight = 295;
var imgHeight = canvas.height * imgWidth / canvas.width;
var heightLeft = imgHeight;
 
const contentDataURL = canvas.toDataURL('image/png')
let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
var position = 0;

pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
pdf.save('new-file.pdf'); // Generated PDF
});
  }
  */

 /*captureScreen() {
  let data = document.getElementById('contentToConvert');
  let pdfSettings = {
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts:true,
    floatPrecision: 'smart'
  };
  let doc = new jspdf(pdfSettings);
   doc.addHTML(data, function() {
      //doc.addImage("", "JPEG", 15, 40, 180, 180);
      //doc.setDisplayMode('fullwidth');
      doc.save("obrz.pdf");
   });
 }*/

 captureScreen(){
   const options = {
     filename:'Report.pdf',
     image :{type: 'jpg'},
     html2canvas:{},
     jspdf:{}
   };
   const  content : Element = document.getElementById('contentToConvert');

   html2pdf()
   .from(content)
   .set(options)
   .save()
 }

 captureScreenTD(){
  const options = {
    filename:'Report.pdf',
    image :{type: 'jpg'},
    html2canvas:{},
    jspdf:{}
  };
  const  content : Element = document.getElementById('contentToConvertTD');

  html2pdf()
  .from(content)
  .set(options)
  .save()
}
}
