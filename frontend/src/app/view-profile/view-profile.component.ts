import { Component, OnInit } from '@angular/core';
import {RegisterService} from '../services/register.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  constructor(private userRegistration: RegisterService) { }
  userData = {};
  ngOnInit() {
    console.log(localStorage.getItem('jwt'));
    let obj = this.userRegistration.checkToken(JSON.stringify(localStorage.getItem('jwt')));
    console.log('sur ' + obj);
    let username = obj.sub;
    console.log(username);
    this.userRegistration.getUser(username).subscribe((data) => {
      this.userData = data;
      console.log(data);
    });
  }

}
