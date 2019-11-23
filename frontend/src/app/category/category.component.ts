import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

// tslint:disable-next-line: class-name
class category {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryName: string;
  category: category;
  breakpoint: number;
  posts: any;
  page = 0;
  size = 6;
  data: any;
  categories: {
    name: string;
    icon: string;
  }[] = [
      {
        name: 'National',
        icon: 'flag'
      },
      {
        name: 'International',
        icon: 'public'
      },
      {
        name: 'Business',
        icon: 'business'
      },
      {
        name: 'Technology',
        icon: 'memory'
      },
      {
        name: 'Entertainment',
        icon: 'movie'
      },
      {
        name: 'Sports',
        icon: 'directions_bike'
      },
      {
        name: 'Science',
        icon: 'whatshot'
      },
      {
        name: 'Health',
        icon: 'fitness_center'
      },
    ];
  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router) { }
  ngOnInit() {

    this.route.url.subscribe(url => {
      this.categoryName = this.route.snapshot.paramMap.get('categoryName');
      this.categories.forEach((c: category) => {
        if (c.name === this.categoryName) {
          this.category = c;
        }
        this.breakpoint = (window.innerWidth <= 777) ? 1 : (window.innerWidth <= 1120 && window.innerWidth > 777)
          ? 2 : (window.innerWidth > 1120) ? 3 : 4;


      });
      const httpOptions = {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json',
          })
      };
      this.http.get(environment.categoryUrl + this.category.name, httpOptions).subscribe(
        (data) => {
          // tslint:disable-next-line: no-string-literal
          this.posts = data['posts'];
          this.posts.sort((b, a) => a.timestamp.localeCompare(b.timestamp));
          this.getData({ pageIndex: this.page, pageSize: this.size });

        }, (error) => {
          this.router.navigateByUrl('/404');
        }
      );
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
