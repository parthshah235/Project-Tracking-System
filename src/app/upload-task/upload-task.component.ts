import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;
  

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit() {
    this.startUpload();
  }

  
  startUpload() {

    // The storage path
    const path = `test/${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        const uId = localStorage.getItem('uid');
        const bId = localStorage.getItem('bid');
        const tId = localStorage.getItem('tid');
        const dtId = localStorage.getItem('dTaskId');
        const dmemId = localStorage.getItem('dMemId');
        const assignedby = localStorage.getItem("assignId");
        /*New User Task
        this.db.collection('boards').doc(uId).collection('boardsDetails').doc(bId)
        .collection('task').doc(tId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});*/

        /*Member 
        const mId = localStorage.getItem('member');
        this.db.collection('boards').doc(mId).collection('boardsDetails').doc(bId)
        .collection('task').doc(tId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});*/

        /*Upload more files */
        
        if(uId == dmemId)
        {
        this.db.collection('boards').doc(uId).collection('boardsDetails').doc(bId)
        .collection('task').doc(dtId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});
        } 
        /*Upload more files member */

        else if(uId != dmemId){
          this.db.collection('boards').doc(uId).collection('boardsDetails').doc(bId)
        .collection('task').doc(dtId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});

        this.db.collection('boards').doc(dmemId).collection('boardsDetails').doc(bId)
        .collection('task').doc(dtId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});
        }

        else{
        this.db.collection('boards').doc(dmemId).collection('boardsDetails').doc(bId)
        .collection('task').doc(dtId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});
        }
        /*this.db.collection('boards').doc(uId).collection('boardsDetails').doc(bId)
        .collection('task').doc(dtId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});*/


        
        console.log("assignById",assignedby);
        this.db.collection('boards').doc(assignedby).collection('boardsDetails').doc(bId)
        .collection('task').doc(dtId).collection('taskAttachments')
        .add( { downloadURL: this.downloadURL, path ,name: this.file.name});
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
