import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [DatePipe]
})
export class EditProfileComponent implements OnInit {
  onlyNewsPreferences: string[];

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private router: Router,
              private userRegistration: RegisterService) { }
  userData: any;

  date1 = new FormControl(new Date());

  maxDate = new Date();
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  titleAlert = 'This field is required';
  post: any = '';
  hide = true;
  submitted = false;
  selectedOptions: string[] = [];
  selectedOption;
  disabled = true;
  userObject: any;
  taskTypeAreas: {
    name: string;
  }[] = [
      {
        name: 'National'
      },
      {
        name: 'International'
      },
      {
        name: 'Business'
      },
      {
        name: 'Technology'
      },
      {
        name: 'Entertainment'
      },
      {
        name: 'Sports'
      },
      {
        name: 'Science'
      },
      {
        name: 'Health'
      }
    ];



  ngOnInit() {

    console.log(localStorage.getItem('jwt'));
    const obj = this.userRegistration.checkToken(JSON.stringify(localStorage.getItem('jwt')));
    console.log('sur ' + obj);
    const username = obj.sub;
    console.log(username);
    this.userRegistration.getUser(username).subscribe((data) => {
      this.userData = data;
      console.log(data);

      this.onlyNewsPreferences = this.userData.newsPreferences;
      this.date1 = this.userData.dateOfBirth;
    });


    const emailregex: RegExp = /[^@]+@[^\.]+\..+/;

    this.firstFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail]
    });

    this.secondFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      validate: ''
    });
    this.thirdFormGroup = this.formBuilder.group({

    });
  }






  isMobile() {
    return (window.innerWidth <= 800);
  }
  isDateNull() {
    return (this.userData.dateOfBirth == null);
  }

  onNgModelChange($event) {
    console.log($event);
    this.selectedOption = $event;

  }


  setChangeValidate() {
    this.firstFormGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate === '1') {
          this.firstFormGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = 'You need to specify at least 3 characters';
        } else {
          this.firstFormGroup.get('name').setValidators(Validators.required);
        }
        this.firstFormGroup.get('name').updateValueAndValidity();
      }
    );
  }

  get name() {
    return this.firstFormGroup.get('name') as FormControl;
  }



  checkInUseEmail(control) {
    // mimic http database access
    const db = ['sdfesfe'];
    return new Observable(observer => {
      setTimeout(() => {
        const result = (db.indexOf(control.value) !== -1) ? { alreadyInUse: true } : null;
        observer.next(result);
        observer.complete();
      }, 1000);
    });
  }

  getErrorEmail() {
    // return this.firstFormGroup.get('email').hasError('required') ? 'Field is required' :
    //   this.firstFormGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
    return this.firstFormGroup.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.firstFormGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.firstFormGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.firstFormGroup.invalid) {
      return;
    }


  }

  onReset() {
    this.submitted = false;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
  }


  update(name, userName, email, selectedOptions) {

    // dateOfBirth = this.datePipe.transform(dateOfBirth, "yyyy-MM-dd");
    this.userObject = {
      name,
      username: userName,
      email,
      dateOfBirth: this.userData.dateOfBirth,
      newsPreferences: selectedOptions,
      posts: this.userData.posts,
      liked: this.userData.liked,
      watched: this.userData.watched,
      flagged: this.userData.flagged,
      bought: this.userData.bought
    };
    console.log(this.userObject);

    this.userRegistration.changeUser(this.userObject, userName)
      .subscribe(
        () => {
          this.ngOnInit();
          this.router.navigateByUrl('/viewProfile');
        }
      );
  }

  selected(category1) {
    console.log(this.onlyNewsPreferences);
    console.log(category1);
    if (this.onlyNewsPreferences == null) { return false; }
    if (this.onlyNewsPreferences.indexOf(category1) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
