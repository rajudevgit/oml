import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {ListDetalsComponent} from './dashboard/list-detals/list-detals.component';

import { KitchenComponent } from './kitchen/kitchen.component';
import { KitchenDetailsComponent } from './kitchen/kitchen-details/kitchen-details.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/list-details', component: ListDetalsComponent },
  { path: 'kitchen/list', component: KitchenComponent },
  { path: 'kitchen/details', component: KitchenDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
