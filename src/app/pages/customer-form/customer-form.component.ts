import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BankAccount } from '../../models/bank-account';
import { Customer } from '../../models/customer';
import { User } from '../../models/user';
import { ApiService } from '../../service/api.service';
import { noNumValidator } from '../../validators/noNumValidator';
import { onlyNumValidator } from '../../validators/onlyNumValidator';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit {
  bankAccTypes: string[] = ['Savings', 'Current', 'Overseas'];
  // selected: string = "---Select options---"

  update(e: any) {
    this.customerForm.controls.bankAccForm.controls.accType.setValue(
      e.target.value, {onlySelf: true}
    );
    // console.log(this.customerForm.getRawValue());
  }

  customer?: Customer = new Customer();
  bankAcc?: BankAccount = new BankAccount();
  user?: User

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {}

  customerForm = new FormGroup({
    custFirstName: new FormControl('', [Validators.required, noNumValidator()]),
    custLastName: new FormControl('', [Validators.required, noNumValidator()]),
    custCity: new FormControl('', [Validators.required, noNumValidator()]),
    custPhone: new FormControl('', [
      Validators.required,
      onlyNumValidator(),
      Validators.maxLength(8),
    ]),
    bankAccForm: new FormGroup({
      accType: new FormControl(''),
      accBal: new FormControl('', [onlyNumValidator()]),
    }),
  });

  get custFirstName(): any {
    return this.customerForm.controls.custFirstName;
  }

  get custLastName(): any {
    return this.customerForm.controls.custLastName;
  }

  get custCity(): any {
    return this.customerForm.controls.custCity;
  }

  get custPhone(): any {
    return this.customerForm.controls.custPhone;
  }

  get accBal(): any {
    return this.customerForm.controls.bankAccForm.controls.accBal;
  }

  onSubmit() {
    console.log(this.customerForm.getRawValue());
    let form = this.customerForm.getRawValue();

    this.bankAcc!.accType = this.customerForm.getRawValue().bankAccForm.accType
    this.bankAcc!.accBal = parseFloat(form.bankAccForm.accBal ? form.bankAccForm.accBal : '0')

    this.customer!.custFirstName = form.custFirstName
    this.customer!.custLastName = form.custLastName
    this.customer!.custCity = form.custCity
    this.customer!.custPhone = form.custPhone
    this.customer!.bankAcc = this.bankAcc

    //! subscribe
    // https://stackoverflow.com/questions/42104629/angular-2-checking-for-server-errors-from-subscribe
    // https://rxjs.dev/deprecations/subscribe-arguments
    this.apiService.saveCustomer(this.customer).subscribe({
      next: (res) => {
        this.user = res;
        console.log('saved user: ' + this.user);
        this.customerForm.reset();
        this.router.navigate(['/all-customers']);
      },
      error: (err) => {
        console.log(err)
        console.log(err.error.error_message);
        if (err.error.error_message.includes('constraint')) {
          window.alert('Username taken');
        }
      },
    });
  }
}
