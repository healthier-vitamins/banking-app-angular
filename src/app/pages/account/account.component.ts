import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { catchError, lastValueFrom, pipe, tap } from 'rxjs';
import { changePasswordModel } from 'src/app/models/changePassword.model';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/service/api.service';
import { passwordValidator } from 'src/app/validators/passwordValidator';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  changingPasswordState: boolean = false;

  loggedInUser: User = new User();
  changePasswordObj?: changePasswordModel = {
    username: '',
    oldPassword: '',
    newPassword: '',
  };

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {}

  changePasswordForm = this.formBuilder.group({
    oldPassword: ['', Validators.required, Validators.minLength(3)],
    newPassword: ['', [passwordValidator(), Validators.required, Validators.minLength(3)]],
    repeatNewPassword: ['', [passwordValidator(), Validators.required, Validators.minLength(3)]],
  });

  get oldPassword() {
    return this.changePasswordForm.controls.oldPassword
  }

  get newPassword() {
    return this.changePasswordForm.controls.newPassword;
  }

  get repeatNewPassword() {
    return this.changePasswordForm.controls.repeatNewPassword;
  }

  onSubmit() {
    if (
      this.newPassword.getRawValue() !== this.repeatNewPassword.getRawValue()
    ) {
      window.alert('New passwords does not match');
    } else {
      this.changePasswordObj!.username = !!localStorage.getItem('username')
        ? localStorage.getItem('username')
        : '';
      this.changePasswordObj!.oldPassword =
        this.changePasswordForm.controls.oldPassword.getRawValue();
      this.changePasswordObj!.newPassword =
        this.changePasswordForm.controls.newPassword.getRawValue();
      this.apiService
        .changePassword(this.changePasswordObj).subscribe({
          next: (res) => {
            console.log(res)
            this.handleCancel()
          },
          error: (err) => {
            if (err.status == 406) {
              window.alert('Old password is incorrect');
            } else if (err.status == 404) {
              window.alert('Something went wrong with username');
            }
          }
        })
    }
  }

  handleCancel() {
    this.changingPasswordState = !this.changingPasswordState;
    this.changePasswordForm.reset();
  }

  ngOnInit(): void {
    this.loadLoggedInUser();
  }

  async loadLoggedInUser() {
    this.loggedInUser = (await lastValueFrom(
      this.apiService.getUserByUsername(localStorage.getItem('username'))
    )) as User;
    console.log(this.loggedInUser);
  }
}
