import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterService } from '../services/register.service';
import { MatStepper } from '@angular/material';
import { PrefixNot } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
  selectable = true;
  userObject: any;

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


  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private router: Router,
              private registration: RegisterService,
              private snackBar: MatSnackBar) { }

  get name() {
    return this.firstFormGroup.get('name') as FormControl;
  }
  isMobile() {
    return (window.innerWidth <= 1024);
  }

  ngOnInit() {

    // tslint:disable-next-line:max-line-length
    const emailRegex: RegExp = /[^@]+@[^\.]+\..+/;

    this.firstFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, this.checkPassword]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)], this.checkInUseEmail]
    });

    this.firstFormGroup.statusChanges.subscribe(
      status => {
        if (status === 'VALID') {
          this.stepper.next();
        }
        // console.log(status);
      }
    );

    this.secondFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      validate: ''
    });

    this.secondFormGroup.statusChanges.subscribe(
      status => {
        if (status === 'VALID') {
          this.stepper.next();
        }
        // console.log(status);
      }
    );

    this.thirdFormGroup = this.formBuilder.group({
    });
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

  checkPassword(control) {
    const enteredPassword = control.value;
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { requirements: true } : null;
  }

  checkInUseEmail(control) {
    // mimic http database access
    const db = ['esdsefsef'];
    return new Observable(observer => {
      setTimeout(() => {
        const result = (db.indexOf(control.value) !== -1) ? { alreadyInUse: true } : null;
        observer.next(result);
        observer.complete();
      }, 1000);
    });
  }

  getErrorEmail() {
    return this.firstFormGroup.get('email').hasError('required') ? 'Field is required' :
      this.firstFormGroup.get('email').hasError('pattern') ? 'Not a valid email address' :
        this.firstFormGroup.get('email').hasError('alreadyInUse') ? 'This email address is already in use' : '';
  }

  getErrorPassword() {
    return this.firstFormGroup.get('password')
      .hasError('required') ?
      'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.firstFormGroup.get('password').
        hasError('requirements') ?
        'Password needs to be at least eight characters, one uppercase letter and one number' : '';
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

  register(name, username, email, dateOfBirth, password, newsPreferences) {

    const pref: string[] = [];
    newsPreferences.forEach(element => {
      pref.push(element.name);
    });
    console.log(pref);
    dateOfBirth = this.datePipe.transform(dateOfBirth, 'yyyy-MM-dd');
    this.userObject = {
      name,
      username,
      email,
      password,
      dateOfBirth,
      pref
    };
    // console.log(this.userObject);

    this.registration.saveUser(this.userObject)
      .subscribe(
        () => {
          console.log(this.userObject);
          this.ngOnInit();
          this.snackBar.open('You are now registered!', 'close ', {
            duration: 4000
          });
          this.router.navigateByUrl('/trending');
        }
      );
  }

  isSelected(selectedOption: any): boolean {
    const index = this.selectedOptions.indexOf(selectedOption);
    return index >= 0;
  }

  toggleOffer(selectedOption: any): void {
    const index = this.selectedOptions.indexOf(selectedOption);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(selectedOption);
    }
  }
}
