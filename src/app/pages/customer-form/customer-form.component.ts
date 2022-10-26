import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lessThanTenThousand } from 'src/app/validators/lessThanTenThousand';
import { BankAccount } from '../../models/bank-account';
import { Customer } from '../../models/customer';
import { Role } from '../../models/role';
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
      e.target.value
    );
  }

  customer?: Customer;
  bankAcc?: BankAccount;
  role: Role = new Role(1, 'ROLE_USER');
  user?: User;

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
      accType: new FormControl('Savings'),
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
    let temp = this.customerForm.getRawValue();
    let tempAccBal = this.customerForm.getRawValue().bankAccForm.accBal;
    this.bankAcc = new BankAccount(
      null,
      this.customerForm.getRawValue().bankAccForm.accType,
      parseFloat(tempAccBal ? tempAccBal : '0'),
      null
    );

    this.customer = new Customer(
      null,
      temp.custFirstName,
      temp.custLastName,
      temp.custCity,
      temp.custPhone,
      this.bankAcc
    );
    // console.log(this.customer)
    this.user = new User(
      null,
      `${temp.custFirstName}`,
      `${temp.custFirstName}-user`,
      // supposed to be done in the backend
      'Aa@123',
      this.customer,
      [this.role]
    );
    // console.log(this.user)

    // this.user = await lastValueFrom(this.apiService.saveCustomer(this.user)) as User

    //! subscribe
    // https://stackoverflow.com/questions/42104629/angular-2-checking-for-server-errors-from-subscribe
    // https://rxjs.dev/deprecations/subscribe-arguments
    this.apiService.saveCustomer(this.user).subscribe({
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
