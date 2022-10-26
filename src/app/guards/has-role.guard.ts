import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  hasRole: boolean[] = []
  
  constructor(private authService: AuthService, private router: Router) { }
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // console.log("user's role: " + this.authService.user.roles)
      try {
        if(this.authService.user.roles.includes(route.data['role'])) return true
        window.alert("i forbid")
        this.router.navigate(["/"])
        return false
      } catch(err) {
        console.log(err)
        
        const len = localStorage.length - 2
        for(let i = 0; i < len; i++) {
          let role = localStorage.getItem(`role${i}`)
          console.log(role)
          if(role === route.data['role']) return true
        }
        window.alert("i forbid")
        return false
      }
  }
  
}
