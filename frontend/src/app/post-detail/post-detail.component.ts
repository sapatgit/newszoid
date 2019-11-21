import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatVideoComponent } from 'mat-video/app/video/video.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EditpostComponent } from '../editpost/editpost.component';
import { DOCUMENT } from '@angular/common';
import { FlagPostComponent } from '../flag-post/flag-post.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, AfterViewInit {

  post: any;
  postId: string;
  views: number;
  likes: number;
  flags: number;
  bought: number;
  isLiked: boolean;
  isFlagged: boolean;
  isOwner: boolean;
  user: any;
  post1: any;
  loc: string;

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      })
  };

  @ViewChild('video', { static: false }) matVideo: MatVideoComponent;
  video: HTMLVideoElement;

  constructor(private http: HttpClient,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if (localStorage.getItem('jwt') == null) {
      this.openLogin();
    }
    this.postId = this.route.snapshot.paramMap.get('postId');

    this.http.get(environment.uploadPostUrl + this.postId, this.httpOptions).subscribe(
      (data) => {
        this.post = data;
        // console.log(this.post.fullLocation);
        if (this.post.fullLocation !== null) {
          const arr = this.post.fullLocation.split(',');
          this.loc = arr[arr.length - 4];
          this.loc = this.loc.trim();
        }
        if (this.post.postedBy === localStorage.getItem('username')) {
          this.isOwner = true;
        } else {
          this.isOwner = false;
        }
        if (!this.post.watchedBy) {
          this.views = 0;
        } else {
          this.views = this.post.watchedBy.length;
        }
        if (!this.post.boughtBy) {
          this.bought = 0;
        } else {
          this.bought = this.post.boughtBy.length;
        }
        if (!this.post.likedBy) {
          this.likes = 0;
        } else {
          this.likes = this.post.likedBy.length;
          if (this.post.likedBy.indexOf(localStorage.getItem('username')) !== -1) {
            this.isLiked = true;
          }
        }

        if (!this.post.flaggedBy) {
          this.flags = 0;
        } else {
          this.flags = this.post.flaggedBy.length;
          if (this.post.flaggedBy.indexOf(localStorage.getItem('username')) !== -1) {
            this.isFlagged = true;
          }
        }
      }
    );
    this.http.get(environment.registerUrl + '/' + localStorage.getItem('username'), this.httpOptions).subscribe(
      (data) => {
        this.user = data;
      }
    );
  }

  ngAfterViewInit(): void {
    this.video = this.matVideo.getVideoTag();
    this.video.addEventListener('ended', () => this.watch());
  }

  getIsLiked() {
    return this.isLiked;
  }

  getIsFlagged() {
    return this.isFlagged;
  }

  like() {
    if (this.likes === 0) {
      const likes: string[] = [];
      likes.push(localStorage.getItem('username'));
      this.post.likedBy = likes;
      this.user.liked.push(this.post);
    } else {
      const index = this.post.likedBy.indexOf(localStorage.getItem('username'));
      if (index !== -1) {
        this.post.likedBy.splice(index, 1);
        const ind = this.user.liked.indexOf(this.postId);
        if (ind !== -1) {
          this.user.liked.splice(ind, 1);
        }
        this.isLiked = false;
      } else {
        this.user.liked.push(this.post);
        this.post.likedBy.push(localStorage.getItem('username'));
      }
    }

    this.http.put(environment.uploadPostUrl, this.post, this.httpOptions).subscribe(
      (data) => {
        this.http.put(environment.registerUrl + '/' + localStorage.getItem('username'), this.user, this.httpOptions).subscribe();
        this.ngOnInit();
      }
    );

  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px',
    });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  flag() {
    if (this.flags === 0) {
      const flags: string[] = new Array();
      flags.push(localStorage.getItem('username'));
      this.post.flaggedBy = flags;
      this.user.flagged.push(this.post);
      const dialogRef = this.dialog.open(FlagPostComponent, {
        width: '250px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          return;
        }
        this.http.put(environment.uploadPostUrl, this.post, this.httpOptions).subscribe(
          (data) => {
            this.http.put(environment.registerUrl + '/' + localStorage.getItem('username'), this.user, this.httpOptions).subscribe();
            this.ngOnInit();
          }
        );
      });
    } else {
      const index = this.post.flaggedBy.indexOf(localStorage.getItem('username'));
      if (index !== -1) {
        this.post.flaggedBy.splice(index, 1);
        const ind = this.user.flagged.indexOf(this.postId);
        if (ind !== -1) {
          this.user.flagged.splice(ind, 1);
        }
        this.isFlagged = false;
      } else {
        this.user.flagged.push(this.post);
        this.post.flaggedBy.push(localStorage.getItem('username'));
      }

      const dialogRef = this.dialog.open(FlagPostComponent, {
        width: '250px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          return;
        }
        this.http.put(environment.uploadPostUrl, this.post, this.httpOptions).subscribe(
          (data) => {
            this.http.put(environment.registerUrl + '/' + localStorage.getItem('username'), this.user, this.httpOptions).subscribe();
            this.ngOnInit();
          }
        );
      });
    }
  }

  watch() {
    console.log("video logged")
    if (this.views === 0) {
      const view: string[] = new Array();
      view.push(localStorage.getItem('username'));
      this.post.watchedBy = view;
      this.user.watched.push(this.post);
    } else {
      const index = this.post.watchedBy.indexOf(localStorage.getItem('username'));
      if (index === -1) {
        this.post.watchedBy.push(localStorage.getItem('username'));
        this.user.watched.push(this.post);
      }
    }

    this.http.put(environment.uploadPostUrl, this.post, this.httpOptions).subscribe(
      () => {
        this.http.put(environment.registerUrl + '/' + localStorage.getItem('username'), this.user, this.httpOptions).subscribe();
        this.ngOnInit();
      }
    );
  }

  openEdit(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: this.post.id,
      title: this.post.title,
      category: this.post.category,
      location: this.post.location,
      videoUrl: this.post.videoUrl,
      timestamp: this.post.timestamp
    };
    dialogConfig.width = '350px';
    this.dialog.open(EditpostComponent, dialogConfig);
  }

  download(url: string): void {
    if (this.bought === 0) {
      const buys: string[] = new Array();
      buys.push(localStorage.getItem('username'));
      this.post.boughtBy = buys;
      this.user.bought.push(this.post);
    } else {
      const index = this.post.bought.indexOf(localStorage.getItem('username'));
      if (index === -1) {
        this.post.boughtBy.push(localStorage.getItem('username'));
        this.user.bought.push(this.post);
      }
    }

    this.http.put(environment.uploadPostUrl, this.post, this.httpOptions).subscribe(
      () => {
        this.http.put(environment.registerUrl + '/' + localStorage.getItem('username'), this.user, this.httpOptions).subscribe();
        this.ngOnInit();
      }
    );
    this.document.location.href = url;
  }

  edit(): void {
    this.openEdit();
  }

  delete(): void {
    const posts = this.user.posts;
    let i = posts.length;
    while (i--) {
      if (posts[i].id == this.postId) {
        console.log('found!');
        posts.splice(i, 1);
      }
    }
    this.user.posts = posts;
    this.http.put(environment.registerUrl + '/' + localStorage.getItem('username'), this.user, this.httpOptions).subscribe();
    this.http.delete(environment.uploadPostUrl + this.postId, this.httpOptions).subscribe();
    this.router.navigateByUrl('/posted');
  }

}
