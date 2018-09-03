import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImprintComponent } from './subsites/imprint/imprint.component';
import { AboutComponent } from './subsites/about/about.component';
import { LandingComponent } from './ui/landing/landing.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: LandingComponent },
  { path: 'about', component: AboutComponent},
  { path: 'imprint', component: ImprintComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

