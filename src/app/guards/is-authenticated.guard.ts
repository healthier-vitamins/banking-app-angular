import { DoCheck, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedGuard implements CanActivate {

  // isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    
  }

  // ngDoCheck(): void {
  //   if(localStorage.getItem("token")) {
  //     this.isLoggedIn = true
  //   } else {
  //     this.isLoggedIn = false
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    // if(this.isLoggedIn) this.authService.updateIsLogged(true)
    // if (!this.isLoggedIn) this.router.navigate(['/login']);
    // return this.isLoggedIn
    return this.authService.isLoggedIn$.pipe(
      tap((logged: boolean) => {
        if (!logged) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
