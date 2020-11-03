import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { ReziActionAppWrapperComponent } from './rezi-action-app-wrapper.component';
import { ReziActionAppComponent } from './rezi-action-app/rezi-action-app.component';
import { SupportComponent } from './support/support.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { DisabledMessageComponent } from './disabled-message/disabled-message.component';


@NgModule({
  declarations: [
    ReziActionAppWrapperComponent,
    ReziActionAppComponent,
    SupportComponent,
    SpinnerComponent,
    ErrorMessageComponent,
    DisabledMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ReziActionAppWrapperComponent]
})
export class AppModule { }
