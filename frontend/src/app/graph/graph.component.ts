import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @ViewChild('lineChart', { static: true }) private chartRef;
  @ViewChild('pieChart', { static: true }) private pieRef;
  category1 = [];
  category2 = [];
  views = [];
  likes = [];
  flag = [];
  chart: any;
  title = [];
  data = [];
  data1 = [];
  count = [];


  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.BarChart();
    this.PieChart();
  }

  BarChart() {
    let _url = 'https://newszoid.stackroute.io:8443/content-service/api/v1/post/trending';
    this.http.get(_url).subscribe((data: any) => {
      if (data) {
        data.forEach(post => {
          this.category1.push(post.category);
          if (this.title.length < 10) {
            this.title.push(post.title);
          }
          this.views.push(post.watchedBy.length);
          if (post.likedBy == null) {
            this.likes.push(0);
          } else {
            this.likes.push(post.likedBy.length);
          }
          if (post.flaggedBy == null) {
            this.flag.push(0);
          } else {
            this.flag.push(post['flaggedBy'].length);
          }
        });
      }
      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.title,
          datasets: [
            {
              label: 'views',
              data: this.views,
              backgroundColor: '#aad2ed',
            },
            {
              label: 'likes',
              data: this.likes,
              backgroundColor: '#EF6C00',
            },
            {
              label: 'flag',
              data: this.flag,
              backgroundColor: '#00796B'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Trending News Analysis',
            fontSize: 30
          },

          legend: {
            display: true,
            position: 'top',

          },
          scales: {
            xAxes: [{
              stacked: true,
              barPercentage: 0.7,
              display: true,
              ticks: {
                fontSize: 12,
                fontStyle: 'bold',
              },
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 10,
                stepSize: 1,
              }

            }],
          }
        }
      });
    });

  }

  PieChart() {
    const categories: {
      name: string;
    }[] = [
        {
          name: 'National',

        },
        {
          name: 'International',

        },
        {
          name: 'Business',

        },
        {
          name: 'Technology',

        },
        {
          name: 'Entertainment',

        },
        {
          name: 'Sports'
        },
        {
          name: 'Science',

        },
        {
          name: 'Health',

        },
      ];
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        })
    };
    let i = 0;
    const len = categories.length;
    categories.forEach(category => {
      i++;
      const url = 'https://newszoid.stackroute.io:8443/content-service/api/v1/posts/' + category.name;
      this.http.get(url, httpOptions).subscribe((data1: any) => {
        this.count.push(data1.length);
        this.category2.push(category.name);
        if (i === len) {
          this.chart = new Chart(this.pieRef.nativeElement, {
            type: 'pie',
            data: {
              labels: this.category2,
              datasets: [
                {
                  data: this.count,
                  backgroundColor: ['#388E3C', '#616161', '#7B1FA2', '#FFA000', '#00695C', '#40C4FF', '#303F9F', '#D84315']
                },
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              title: {
                display: true,
                text: 'NewsZoid Content',
                fontSize: 30
              },

              legend: {
                display: true,
                position: 'top',

              },
            }

          });
        }

      });
    });

  }
}




