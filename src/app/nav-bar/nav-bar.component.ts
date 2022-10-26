import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, DoCheck {

  houseOfLogics = {
    isLoggedIn: false,
    role: "NULL"
  }
  roles: string[] = []

  constructor(private authService: AuthService) { 

  }
  // ngOnDestroy(): void {
  //   localStorage.clear()
  // }

  ngDoCheck(): void {
    // console.log("test docheck")
    if(localStorage.getItem("token")) {
      this.houseOfLogics.isLoggedIn = true
      // this.authService.updateIsLogged(true)
    } else {
      this.houseOfLogics.isLoggedIn = false
      // this.authService.updateIsLogged(false)
    } 
    
    const len = localStorage.length - 2
    for(let i = 0; i < len; i++) {
      let role = localStorage.getItem(`role${i}`)
      this.roles.push(role? role : "")
    }
   
    if(this.roles) {
      if(this.roles.includes("ROLE_ADMIN")) {
        this.houseOfLogics.role = "ADMIN"
      } else {
        this.houseOfLogics.role = "USER"
      } 
    } else {
      this.houseOfLogics.role = "NULL"
    }
  }

  ngOnInit(): void {

  }

  handleLogout() {
    localStorage.clear()
    this.authService.isLoggedIn$.pipe
  }


}
