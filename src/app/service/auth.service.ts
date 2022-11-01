import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit{
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private readonly TOKEN_NAME = 'token';

  user!: UserModel

  constructor(private router: Router, private apiService: ApiService) {
    this._isLoggedIn$.next(!!this.token)
  }
  
  ngOnInit(): void {
    this.user = this.getUser(this.token ? this.token : "")
  }

  get token() {
    return localStorage.getItem(this.TOKEN_NAME)
  }

  authLogin(loginForm: FormGroup) {
    return this.apiService.doLogin(loginForm)

    .pipe(
      tap((res: any) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem(this.TOKEN_NAME, res.access_token);
        localStorage.setItem("username", loginForm.getRawValue().username)
        console.log(res)
        this.user = this.getUser(res.access_token) 
        console.log(this.user)
        for(let i = 0; i < this.user.roles.length; i++) {
          localStorage.setItem(`role` + `${i}`, this.user.roles[i].toString())
        }
        
      })
      ,
      catchError((err) => {
        console.log(err.status);
        if (err.status === 403) {
          window.alert('Wrong username/password');
          this.router.navigate(['/login']);
          return err;
        }
      })
    );
  }

  private getUser(token: string) {
    // console.log(jwtDecode(token))
    return jwtDecode(token) as UserModel
  }

}
