import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasRoleGuard } from './guards/has-role.guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { AllCustomersComponent } from './pages/all-customers/all-customers.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { LoginComponent } from './pages/login/login.component';
import { ViewOffersComponent } from './pages/view-offers/view-offers.component';

const routes: Routes = [
  { path: '', component: AboutComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'all-customers',
    component: AllCustomersComponent,
    canActivate: [IsAuthenticatedGuard, HasRoleGuard],
    data: {
      role: 'ROLE_ADMIN',
    },
  },
  {
    path: 'customer-form',
    component: CustomerFormComponent,
    canActivate: [IsAuthenticatedGuard, HasRoleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'view-offers',
    component: ViewOffersComponent,
    canActivate: [IsAuthenticatedGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
