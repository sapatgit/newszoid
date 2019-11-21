import { Component, OnInit } from '@angular/core';
import { PostedService } from '../services/posted.service';

@Component({
  selector: 'app-watched',
  templateUrl: './watched.component.html',
  styleUrls: ['./watched.component.css']
})
export class WatchedComponent implements OnInit {

  posts: any;
  breakpoint: number;
  page = 0;
  size = 6;
  data: any;

  constructor(private posted: PostedService) { }

  ngOnInit() {
    this.posted.getPosts().subscribe(data => {
      this.posts = data['watched'];
      this.getData({ pageIndex: this.page, pageSize: this.size });


      this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
        ? 2 : (window.innerWidth > 1120) ? 3 : 4;
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
