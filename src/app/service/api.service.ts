import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { changePasswordModel } from '../models/changePassword.model';
import { Customer } from '../models/customer';
import { Offer } from '../models/offer';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_PATH = `http://localhost:8080/api`

  constructor(private http: HttpClient) { }

  doLogin(loginForm: FormGroup) {
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    return this.http.post(`http://localhost:8080/login`, JSON.stringify(loginForm.getRawValue()), {headers: reqHeader})
  }

  saveCustomer(cust: Customer | null | undefined) {
    return this.http.post(this.API_PATH + "/user/save", JSON.stringify(cust), {headers: {"Content-Type": 'application/json'}})
  }

  allUsers() {
    return this.http.get(this.API_PATH + "/user/all", {headers: {"Content-Type": 'application/json'}})
  }

  saveUser(user: User, isUpdating: boolean) {
    if(isUpdating) {
      return this.http.put(this.API_PATH + "/user/save", JSON.stringify(user), {headers: {"Content-Type": 'application/json'}} )
    } else {
      return this.http.post(this.API_PATH + "/user/save", JSON.stringify(user), {headers: {"Content-Type": 'application/json'}})
    }
  }

  saveUpdatedUser(user: User) {
    return this.http.put(this.API_PATH + "/user/save-updated", JSON.stringify(user), {headers: {"Content-Type": 'application/json'}})
  }

  getUserById(id: number) {
    return this.http.get(this.API_PATH + `/user/get/${id}`)
  }

  deleteUserById(id: number) {
    return this.http.delete(this.API_PATH + `/user/delete/${id}`, {headers: {"Content-Type": 'application/json'}})
  }

  getUserByUsername(username: string | null) {
    return this.http.get(this.API_PATH + `/user/get-username/${username}`, {headers: {"Content-Type": 'application/json'}})
  }

  getCreditCardOffer(user: User | null | undefined) {
    return this.http.post(this.API_PATH + "/offer/credit-card", JSON.stringify(user), {headers: {"Content-Type": 'application/json'}})
  }

  getHomeLoanOffer(user: User | null | undefined) {
    return this.http.post(this.API_PATH + "/offer/home-loan", JSON.stringify(user), {headers: {"Content-Type": 'application/json'}})
  }

  getCarLoanOffer(user: User | null | undefined) {
    return this.http.post(this.API_PATH + "/offer/car-loan", JSON.stringify(user), {headers: {"Content-Type": 'application/json'}})
  }

  saveOffer(offer: Offer | null | undefined) {
    return this.http.post(this.API_PATH + "/offer/save", JSON.stringify(offer), {headers: {"Content-Type": 'application/json'}}) 
  }

  // https://www.bezkoder.com/angular-14-refresh-token/
  refreshToken() {

  }

  getOffersByCustId(custId: number | null | undefined) {
    return this.http.get(this.API_PATH + `/offer/cust-all/${custId}`)
  }

  delOffersById(offerId: number | null | undefined) {
    return this.http.delete(this.API_PATH + `/offer/delete/${offerId}`)
  }

  changePassword(changePasswordObj: changePasswordModel | null | undefined) {
    return this.http.post(this.API_PATH + `/user/change-password`, JSON.stringify(changePasswordObj), {headers: {"Content-Type": 'application/json'}})
  }

}
