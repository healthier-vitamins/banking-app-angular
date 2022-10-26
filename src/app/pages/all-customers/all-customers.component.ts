import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { noNumValidator } from '../../validators/noNumValidator';
import { onlyNumValidator } from '../../validators/onlyNumValidator';
import { BankAccount } from '../../models/bank-account';
import { Customer } from '../../models/customer';
import { Offer } from '../../models/offer';
import { User } from '../../models/user';
import { ApiService } from '../../service/api.service';
import { lessThanTenThousand } from 'src/app/validators/lessThanTenThousand';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css'],
})
export class AllCustomersComponent implements OnInit {
  bankAccTypes: string[] = ['Savings', 'Current', 'Overseas'];

  update(e: any) {
    this.customerForm.controls.bankAccForm.controls.accType.setValue(
      e.target.value
    );
  }

  listOfUser: User[] = [];
  listOfOffers?: Offer[] 
  isUpdating: boolean = false;
  showConfirmDel: boolean = false;

  offer: Offer = {
    offerId: null,
    offerName: null,
    custId: null,
    annualFee: null,
    interestFreeCashWithdrawal: null,
    interestRatePercent: null,
    loanAmnt: null,
    preclosureCharges: null,
  };

  bankAcc: BankAccount = {
    accId: null,
    accType: '',
    accBal: 0,
    accCreationDate: '',
  };

  customer: Customer = {
    custId: null,
    custFirstName: '',
    custLastName: '',
    custCity: '',
    custPhone: '',
    bankAcc: this.bankAcc,
    offers: [],
  };

  user: User = {
    id: null,
    name: '',
    username: '',
    password: '',
    customer: this.customer,
    roles: [],
  };

  accBalTemp?: number

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAllUsers();

    // this.fillListOfOffers();
  }

  async getAllUsers() {
    this.listOfUser = await lastValueFrom(
      this.apiService.allUsers()
    ) as User[];
    console.log(this.listOfUser);

    // console.log(this.listOfCustomer)
    // var date = new Date("2022-10-19 17:37:54:388")
    // console.log(date.getTime())
  }

  // fillListOfOffers() {
  //   for (let i = 0; i < this.listOfUser.length; i++) {
  //     this.listOfOffers = !!this.listOfUser[i].customer?.offers ? this.listOfUser[i].customer!.offers : [];
      // if (!!temp) {
      //   for (let y = 0; y < temp!.length; y++) {
      //     this.listOfOffers.push(temp[y]);
      //   }
      //   console.log('list of offers please ' + this.listOfOffers);
      // }
  //   }
  // }

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

  get custFirstName() {
    return this.customerForm.controls.custFirstName;
  }

  get custLastName() {
    return this.customerForm.controls.custLastName;
  }

  get custCity() {
    return this.customerForm.controls.custCity;
  }

  get custPhone() {
    return this.customerForm.controls.custPhone;
  }

  get accBal() {
    return this.customerForm.controls.bankAccForm.controls.accBal;
  }

  async onSubmit() {
    // console.log(this.user.customer?.custPhone)
    const rawValue = this.customerForm.getRawValue();
    console.log("ACCOUNT TYPE " + rawValue.bankAccForm.accType)
    this.user.customer!.custFirstName = rawValue.custFirstName;
    this.user.customer!.custLastName = rawValue.custLastName;
    this.user.customer!.custCity = rawValue.custCity;
    this.user.customer!.custPhone = rawValue.custPhone;
    this.user.customer!.bankAcc!.accType = rawValue.bankAccForm.accType;
    this.user.customer!.bankAcc!.accBal = parseFloat(
      !!rawValue.bankAccForm.accBal ? rawValue.bankAccForm.accBal : ''
    );
    await lastValueFrom(this.apiService.saveUpdatedUser(this.user));
    this.getAllUsers();
    this.isUpdating = !this.isUpdating;
    this.customerForm.reset();
  }

  handleCancel() {
    this.bankAcc = {
      accId: null,
      accType: '',
      accBal: 0,
      accCreationDate: '',
    };

    this.customer = {
      custId: null,
      custFirstName: '',
      custLastName: '',
      custCity: '',
      custPhone: '',
      bankAcc: this.bankAcc,
    };

    this.user = {
      id: null,
      name: '',
      username: '',
      password: '',
      customer: this.customer,
      roles: [],
    };
    this.isUpdating = !this.isUpdating;
  }

  async handleEdit(id: number) {
    this.isUpdating = !this.isUpdating;
    this.user = (await lastValueFrom(this.apiService.getUserById(id))) as User;
    console.log(this.user);
    this.customerForm.setValue({
      custFirstName: !!this.user.customer?.custFirstName
        ? this.user.customer?.custFirstName
        : '',
      custLastName: !!this.user.customer?.custLastName
        ? this.user.customer?.custLastName
        : '',
      custCity: !!this.user.customer?.custCity
        ? this.user.customer?.custCity
        : '',
      custPhone: !!this.user.customer?.custPhone
        ? this.user.customer?.custPhone
        : '',
      bankAccForm: {
        accType: !!this.user.customer?.bankAcc?.accType
          ? this.user.customer?.bankAcc?.accType
          : this.customerForm.controls.bankAccForm.controls.accType.value,
        accBal: !!this.user.customer?.bankAcc?.accBal
          ? this.user.customer?.bankAcc?.accBal?.toString()
          : '',
      },
    });
  }

  async handleDel(id: number) {
    if (id !== 0) {
      await lastValueFrom(this.apiService.deleteUserById(id));
      this.getAllUsers();
      this.showConfirmDel = !this.showConfirmDel;
    }
  }

  handleValidator(user: User) {
    let tempBal = user.customer!.bankAcc!.accBal ? user.customer!.bankAcc!.accBal : 0
    if(tempBal > 10000) {
      this.showConfirmDel = !this.showConfirmDel;
    } else {
      window.alert("Account canont be deleted since it has less than $10000")
    }
  }
}
