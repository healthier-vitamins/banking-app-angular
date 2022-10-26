import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './pages/about/about.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http"
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';
import { AccountComponent } from './pages/account/account.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { AllCustomersComponent } from './pages/all-customers/all-customers.component';
import { ViewOffersComponent } from './pages/view-offers/view-offers.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NavBarComponent,
    LoginComponent,
    AccountComponent,
    CustomerFormComponent,
    HasRoleDirective,
    AllCustomersComponent,
    ViewOffersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
    
  ],
  providers: [AuthInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
