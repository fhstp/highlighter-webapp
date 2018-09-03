import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImprintComponent } from './subsites/imprint/imprint.component';

import { HeaderComponent } from './ui/header/header.component';
import { FooterComponent } from './ui/footer/footer.component';
import { AboutComponent } from './subsites/about/about.component';
import { LandingComponent } from './ui/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    ImprintComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
