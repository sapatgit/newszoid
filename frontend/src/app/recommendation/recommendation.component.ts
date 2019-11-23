import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {

  recs: any;
  breakpoint: number;
  posts: any;
  postByAge: any;
  page = 0;
  size = 6;
  data: any;
  dataAge: any;
  dataPref: any;
  postByPref: any;
  constructor(private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + localStorage.getItem('jwt')
        })
    };
    this.http.get('https://newszoid.stackroute.io:8443/recommendation-service/recommend/'
      + localStorage.getItem('username'), httpOptions).subscribe(
        (data) => {
          this.posts = data;
          this.posts.sort((b, a) => a.timestamp.localeCompare(b.timestamp));
          this.getData({ pageIndex: this.page, pageSize: this.size });

        }/*, (error) => {
        this.router.navigateByUrl('/404');
      }*/
      );

    this.http.get('https://newszoid.stackroute.io:8443/recommendation-service/recommend/ageGroup/'
      + localStorage.getItem('username'), httpOptions).subscribe(
        (data) => {
          this.postByAge = data;
          this.postByAge.sort((b, a) => a.timestamp.localeCompare(b.timestamp));
          this.getDataAge({ pageIndex: this.page, pageSize: this.size });

        }/*, (error) => {
        this.router.navigateByUrl('/404');
      }*/
      );
    this.http.get('https://newszoid.stackroute.io:8443/recommendation-service/recommend/newsPreference/'
    + localStorage.getItem('username'), httpOptions).subscribe(
      (data) => {
        this.postByPref = data;
        this.postByPref.sort((b, a) => a.timestamp.localeCompare(b.timestamp));
        this.getDataPref({ pageIndex: this.page, pageSize: this.size });

      }/*, (error) => {
      this.router.navigateByUrl('/404');
    }*/
    );
    this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
      ? 2 : (window.innerWidth > 1120) ? 3 : 4;
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

  getDataAge(obj) {
    let index = 0;
    const startingIndex = obj.pageIndex * obj.pageSize;
    const endingIndex = startingIndex + obj.pageSize;

    this.dataAge = this.postByAge.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
  getDataPref(obj) {
    let index = 0;
    const startingIndex = obj.pageIndex * obj.pageSize;
    const endingIndex = startingIndex + obj.pageSize;

    this.dataPref = this.postByPref.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
}
