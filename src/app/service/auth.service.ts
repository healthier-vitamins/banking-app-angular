import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, lastValueFrom, tap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { ApiService } from './api.service';
import jwtDecode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit{
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  
  private _loggedInUsername$ = new BehaviorSubject<string>("");
  loggedInUsername$ = this._loggedInUsername$.asObservable();

  // test: string = ""

  // private _loggedInUser$ = new BehaviorSubject<User>(new User());
  // loggedInUser$ = this._loggedInUser$.asObservable();

  private readonly TOKEN_NAME = 'token';

  user!: UserModel

  constructor(private router: Router, private apiService: ApiService) {
    this._isLoggedIn$.next(!!this.token)
    
  }
  
  ngOnInit(): void {
    this.user = this.getUser(this.token ? this.token : "")
  }

  // async loadUserIntoLoggedInUser() {
  //   let tempUser = await lastValueFrom(this.apiService.getUserByUsername(this.user.username)) as User
  //   console.log(tempUser)
  // }

  // ngDoCheck(): void {
  //   console.log("test")
  //   try {
  //     console.log("test")
  //     this.roleLogic.roles = this.user.roles
  //   } catch(err) {
  //     for(let i = 0; i < localStorage.length - 1; i++) {
  //       console.log("role" + `${i}`)
  //       let role = localStorage.getItem("role" + `${i}`)
  //       this.roleLogic.roles.push(role ? role : "")
  //     }
  //   }
  //   if(this.roleLogic.roles.length > 0) {
  //     this.roleLogic.bool = true
  //   } else {
  //     this.roleLogic.bool = false
  //   }
  // }


  get token() {
    return localStorage.getItem(this.TOKEN_NAME)
  }

  authLogin(loginForm: FormGroup) {
    return this.apiService.doLogin(loginForm)
    // .subscribe(res => {
    //   this._isLoggedIn$.next(true);
    //   localStorage.setItem(this.TOKEN_NAME, res["access_token"]);
    // })


    .pipe(
      tap((res: any) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem(this.TOKEN_NAME, res.access_token);
        localStorage.setItem("username", loginForm.getRawValue().username)


        // console.log(res.access_token)
        this.user = this.getUser(res.access_token) 

        // console.log(this.user.sub)
        this._loggedInUsername$.next(this.user.sub)
        // console.log(this._loggedInUsername$.getValue())

        // this.test = this._loggedInUsername$.getValue()
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

  // updateIsLogged(bool: boolean) {
  //   this._isLoggedIn$.next(bool)
  //   this._isLoggedIn$.complete()
  // }

  private getUser(token: string) {
    // console.log(jwtDecode(token))
    return jwtDecode(token) as UserModel
  }

  // if(err.status === 401) {
  //   window.alert("forbidden")
  //   this.router.navigate(['/'])
  //   return err
  // }
  
  // hasRole(role: string): boolean {
  //   try {
  //     if(this.roleLogic.bool) return true
  //     return false
  //   } catch(err) {
  //     console.log(err)
  //     const roles: string[] = this.roleLogic.roles
  //     console.log(roles)
  //     if(roles?.includes(role)) return true
  //     return false
  //   }
  // }

}
