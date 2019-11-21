import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-company-register-stepper',
  templateUrl: './company-register-stepper.component.html',
  styleUrls: ['./company-register-stepper.component.css']
})
export class CompanyRegisterStepperComponent implements OnInit {

  handler: any;
  breakpoint: number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }


  private invalidfeedback: string;
  isMobile() {
    return (window.innerWidth <= 450);
  }
chargeCreditCard(name, pass, num, exp, cvv) {
    // let form = document.getElementsByTagName("form")[0];
    let arr = exp.split('/', 2);
    (<any>window).Stripe.card.createToken({
      number: num,
      exp_month: arr[0],
      exp_year: arr[1],
      cvc: cvv
    }, (status: number, response: any) => {
      if (status === 200) {
        let token = response.id;
        console.log(token);
        this.invalidfeedback = '';
        this.snackBar.open('Registration Successful!', 'close ', {
          duration: 4000
        });
        this.router.navigate(['/trending']).then();



        this.chargeCard(token, name, pass);
      } else {
        console.log(response.error.message);
        this.invalidfeedback = response.error.message;

      }
    });
  }


  chargeCard(token: string, name, pass) {
    const header = {
      "token": token,
      "amount": '20000',
      'Content-Type': 'application/json',

    };
    const httpOptions = {
      headers: header
    };
    const headers = new Headers({ 'token': token, 'amount': '100' });
    var parameter = JSON.stringify({ username: name, password: pass });
    console.log(parameter);
    this.http.post('https://newszoid.stackroute.io:8443/registration-service/api/v1/charge', parameter, httpOptions)
      .subscribe(resp => {

        console.log('RESP = ', resp);
        this.snackBar.open('You are now logged in!', 'close ', {
          duration: 4000
        });

      });
  }




  ngOnInit() {

    this.loadStripe();
    this.breakpoint = (window.innerWidth <= 600) ? 1 : 2;
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required]]
      });

    // // this.firstFormGroup.statusChanges.subscribe(
    // //   status => {
    // //     if (status === 'VALID') {
    // //       this.stepper.next();
    // //     }
    // //     // console.log(status);
    // //   }
    // );
    this.secondFormGroup = this.formBuilder.group({
    });
    this.thirdFormGroup = this.formBuilder.group({
      num : ['', Validators.required],
      exp : ['', [Validators.required]],
      cvv : ['', [Validators.required]]
    });
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : 2;

  }
  loadStripe() {

    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_wjGbwX82splBNjohcWU6nBh4008Uzxzm9Z',
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token);
            console.log('Payment Success!!');
          }
        });
      };

      window.document.body.appendChild(s);
    }
  }

}

