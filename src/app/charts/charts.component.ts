import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js'
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { BoardServiceService } from "../services/board-service.service";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  title = 'angular8chartjs';
  canvas: any;
  ctx: any;

  canvasB: any;
  ctxB: any;

  canvasm: any;
  ctxm: any;

  lists;
  taskIds = [];
  open = 0;
  pro = 0;
  qa = 0;
  comple = 0;
  openPercent = 0;
  progressPercent = 0;
  qaPercent = 0;
  closedPercent = 0 ;
  total = 0;
  h = 0;
  l = 0;
  m = 0;

  prio = [];
  mem = [];
  tMem;

  constructor(public authService:AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private boardService: BoardServiceService,)
    {
      
    }

  ngOnInit() {

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
          this.total = this.total + 1;
          taskIds.id = a.payload.doc.id;
          this.taskIds.push(taskIds);
          //console.log("Total task",this.total);
          this.prio.push(taskIds.taskPriority)
          //console.log("Priority",this.prio);
        })
        
        tID.forEach(a => {
          let taskIds:any = a.payload.doc.data();
          //this.total = this.total + 1;
          taskIds.id = a.payload.doc.id;
          this.taskIds.push(taskIds);
          //console.log("Total task",this.total);
          //this.prio.push(taskIds.taskPriority)
          //console.log("Priority",this.prio);
          if(taskIds.taskStatus == 0)
          {
            this.open = this.open + 1;
            let percentage = (this.open / this.total) * 100;
            this.openPercent = Math.floor(percentage);
            console.log("Open",this.open);
          }
          else if(taskIds.taskStatus == 1)
          {
            this.pro = this.pro + 1;
            let percentage = (this.pro / this.total) * 100;
            this.progressPercent = Math.floor(percentage);;
            console.log("In Progress",this.pro);
          }
          else if(taskIds.taskStatus == 2)
          {
            this.qa = this.qa + 1;
            let percentage = (this.qa / this.total) * 100;
            this.qaPercent= Math.floor(percentage);;
            console.log("QA",this.qa);
          }
          else if(taskIds.taskStatus == 3)
          {
            this.comple = this.comple + 1;
            let percentage = (this.comple / this.total) * 100;
            this.closedPercent = Math.floor(percentage);
            console.log("Completed",this.comple);
          }
          
        })
        for(var index in this.prio)
          {
            if(this.prio[index] == "High")
            {
              this.h++;
              console.log("high",this.h); 
            }
            else if(this.prio[index] == "Medium")
            {
              this.m++;
              console.log("med",this.m); 
            }
            if(this.prio[index] == "Low")
            {
              this.l++;
              console.log("low",this.l); 
            }
          }
        this.canvas = document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');
        let myChart = new Chart(this.ctx, {
          type: 'pie',
          data: {
              labels: ["Open %", "In Progress %", "QA Testing %","Closed %"],
              datasets: [{
                  data: [this.openPercent ,this.progressPercent,this.qaPercent,this.closedPercent],
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          
        });

        
        this.canvasB = document.getElementById('myChart1');
        this.ctxB = this.canvasB.getContext('2d');
        let myChart1 = new Chart(this.ctxB, {
          type: 'bar',
          
          data: {
              labels: ["High", "Medium", "Low"],
              
              datasets: [{
                barThickness: 50,
                minBarLength: 2,
                  data: [this.h,this.m,this.l],
                  
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)'
                  ],
                  
                 
              }]
              
          },
          options: {
            legend :{
              display: false
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                            // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            }
        }
          
          
        });


      });

        return this.getMemberName();
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



        /*this.canvasm = document.getElementById('myChart2');
        this.ctxm = this.canvas.getContext('2d');
        let myChart2 = new Chart(this.ctxm, {
          type: 'bar',
          data: {
              labels: [],
              datasets: [{
                  data: [this.openPercent ,this.progressPercent,this.qaPercent,this.closedPercent],
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          
        });*/


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

}
