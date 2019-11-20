import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent implements OnInit {

  handler: any;
  breakpoint: number;


  constructor(private http: HttpClient, private router: Router) { }


  private invalidfeedback: string;

  chargeCreditCard(name, pass, num, exp, cvv) {
    // let form = document.getElementsByTagName("form")[0];
    const arr = exp.split('/', 2);
    ( window as any).Stripe.card.createToken({
      number: num,
      exp_month: arr[0],
      exp_year: arr[1],
      cvc: cvv
    }, (status: number, response: any) => {
      if (status === 200) {
        const token = response.id;
        console.log(token);
        this.invalidfeedback = '';
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
      token,
      amount: '20000',
      'Content-Type': 'application/json',

    };
    const httpOptions = {
      headers: header
    };
    const headers = new Headers({ token, amount: '100' });
    const parameter = JSON.stringify({ username: name, password: pass });
    console.log(parameter);
    this.http.post('https://newszoid.stackroute.io:8443/registration-service/api/v1/charge', parameter, httpOptions)
      .subscribe(resp => {

        console.log('RESP = ', resp);

      });
  }




  ngOnInit() {

    this.loadStripe();
    this.breakpoint = (window.innerWidth <= 600) ? 1 : 2;

  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : 2;

  }
  loadStripe() {

    if (!window.document.getElementById('stripe-script')) {
      const s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = ( window as any).StripeCheckout.configure({
          key: 'pk_test_wjGbwX82splBNjohcWU6nBh4008Uzxzm9Z',
          locale: 'auto',
          token (token: any) {
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
