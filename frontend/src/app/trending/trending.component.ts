import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { PostedService } from '../services/posted.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {

  posts: any;
  breakpoint: number;
  panelOpenState = false;
  page = 0;
  size = 6;
  data: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        })
    };
    this.http.get(environment.uploadPostUrl + 'trending', httpOptions).subscribe(
      (data) => {
        this.posts = data;
        this.posts.sort((b, a) => a.timestamp.localeCompare(b.timestamp));
        this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
          ? 2 : (window.innerWidth > 1120) ? 3 : 4;

        this.getData({ pageIndex: this.page, pageSize: this.size });

      });
  }

  onResize(event) {
    this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
      ? 2 : (window.innerWidth > 1120) ? 3 : 4;
  }

  getData(obj) {
    let index = 0;
    const startingIndex = obj.pageIndex * obj.pageSize;
    const endingIndex = startingIndex + obj.pageSize;

    this.data = this.posts.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
}
