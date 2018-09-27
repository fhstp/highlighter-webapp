import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImprintComponent } from './subsites/imprint/imprint.component';
import { HeaderComponent } from './ui/header/header.component';
import { FooterComponent } from './ui/footer/footer.component';
import { AboutComponent } from './subsites/about/about.component';
import { LandingComponent } from './ui/landing/landing.component';
import { DataLoadingService } from './shared/data-loading.service';
import { VizComponent } from './subsites/viz/viz.component';
import { FakeInjectService } from './util/fake-inject.service';
import { DataStorageService } from './shared/data-storage.service';
import { ConfirmDialogComponent } from './util/modals/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './util/modals/input-dialog/input-dialog.component';
import { MessageDialogComponent } from './util/modals/message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ImprintComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    LandingComponent,
    VizComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
    MessageDialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    DataLoadingService,
    FakeInjectService,
    DataStorageService
  ],
  entryComponents: [
    ConfirmDialogComponent,
    InputDialogComponent,
    MessageDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
