import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom} from 'rxjs';
import { passwordValidator } from '../../validators/passwordValidator';
import { startsWithNumValidator } from '../../validators/startsWithNumValidator';
import { User } from '../../models/user';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// @Injectable({
//   providedIn: 'root'
// })
export class LoginComponent implements OnInit {

  user?: User

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), startsWithNumValidator()]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  get username() {
    return this.loginForm.controls['username']
  }

  get password() {
    return this.loginForm.controls['password']
  }

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {
   }

  ngOnInit(): void {
    // localStorage.clear()
  }

  async onSubmit() {
    // console.log(this.loginForm.getRawValue())
    let logged = await lastValueFrom(this.authService.authLogin(this.loginForm))
    if(logged) this.router.navigate(['/'])

    // this.authService.authLogin(this.loginForm).subscribe(res => {
    //   this.router.navigate(['/'])
    // })

    this.user = await lastValueFrom(this.apiService.getUserByUsername(this.loginForm.getRawValue().username)) as User
    // console.log(this.user)
    this.loginForm.reset()
  }

}
