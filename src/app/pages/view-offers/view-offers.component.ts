import { Component, OnInit } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { Offer } from '../../models/offer';
import { User } from '../../models/user';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-view-offers',
  templateUrl: './view-offers.component.html',
  styleUrls: ['./view-offers.component.css'],
})
export class ViewOffersComponent implements OnInit {
  
  listOfOffersByCustId?: Offer[]
  
  creditCardOffers?: Offer[] = [];
  homeLoanOffers?: Offer[] = [];
  carLoanOffers?: Offer[] = [];

  creditCardOffer?: Offer;
  homeLoanOffer?: Offer;
  carLoanOffer?: Offer;

  user?: User;
  offerNames = ['Credit Card', 'Home Loan', 'Car Loan'];

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getLoggedInUser().finally(() => {
      this.getCreditCardOffer(this.user);
      this.getHomeLoanOffer(this.user);
      this.getCarLoanOffer(this.user);
      this.getOffersByCustId(this.user!.customer!.custId)
    });
    // this.getCreditCardOffer(this.user)
  }

  async getLoggedInUser() {
    this.user = (await lastValueFrom(
      this.apiService.getUserByUsername(localStorage.getItem('username'))
    )) as User;
    console.log(this.user);
    // console.log(this.authService.test)

    // this.authService.loggedInUsername$.pipe(tap(username => {
    //   if(!!username) {
    //    this.apiService.getUserByUsername(username).subscribe(user => {
    //     console.log("user inisde inner subscribe " +  user)
    //     this.user = user
    //    })
    //   }
    // }))
  }

  async getCreditCardOffer(user: User | null | undefined) {
    this.creditCardOffer = (await lastValueFrom(
      this.apiService.getCreditCardOffer(user)
    )) as Offer;
    // this.creditCardOffers!.push(creditCardOffer)
    this.creditCardOffer.custId = user?.customer?.custId;
    console.log(this.creditCardOffer);
  }

  async getHomeLoanOffer(user: User | null | undefined) {
    this.homeLoanOffer = (await lastValueFrom(
      this.apiService.getHomeLoanOffer(user)
    )) as Offer;
    // this.homeLoanOffers!.push(homeLoanOffer)
    console.log(this.homeLoanOffer);
  }

  async getCarLoanOffer(user: User | null | undefined) {
    this.carLoanOffer = (await lastValueFrom(
      this.apiService.getCarLoanOffer(user)
    )) as Offer;
    // this.carLoanOffers!.push(carLoanOffer)
    console.log(this.carLoanOffer);
  }

  // testButton() {
  //   // this.getCreditCardOffer(this.user)
  //   // this.getHomeLoanOffer(this.user)
  //   this.getCarLoanOffer(this.user);
  // }

  async applyCreditCard(creditCardOffer: Offer | null | undefined) {
    creditCardOffer!.custId = this.user!.customer!.custId
    console.log(creditCardOffer)
    creditCardOffer = await lastValueFrom(this.apiService.saveOffer(creditCardOffer)) as Offer
    this.getOffersByCustId(this.user?.customer?.custId)
  }

  async applyHomeLoan(homeLoanOffer: Offer | null | undefined) {
    homeLoanOffer!.custId = this.user!.customer!.custId
    homeLoanOffer = await lastValueFrom(this.apiService.saveOffer(homeLoanOffer)) as Offer
    this.getOffersByCustId(this.user?.customer?.custId)
  }

  async applyCarLoan(carLoanOffer: Offer | null | undefined) {
    carLoanOffer!.custId = this.user!.customer!.custId
    carLoanOffer = await lastValueFrom(this.apiService.saveOffer(carLoanOffer)) as Offer
    this.getOffersByCustId(this.user?.customer?.custId)
  }

  async getOffersByCustId(custId: number | null | undefined) {
    this.listOfOffersByCustId = await lastValueFrom(this.apiService.getOffersByCustId(custId)) as Offer[]
    console.log(this.listOfOffersByCustId)
  }

  async handleDelete(offerId: number |null |undefined) {
    await lastValueFrom(this.apiService.delOffersById(offerId))
    this.getOffersByCustId(this.user?.customer?.custId)
  }

}
