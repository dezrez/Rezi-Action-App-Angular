import { Component, Input, OnInit } from '@angular/core';
import { AppInit } from '../AppInit';
import ReziApi from '../Xhr/ReziApi'
import { AxiosError, AxiosResponse } from 'axios';

@Component({
  selector: 'app-rezi-action-app',
  templateUrl: './rezi-action-app.component.html',
  styleUrls: ['./rezi-action-app.component.css']
})
export class ReziActionAppComponent implements OnInit {
  ReziApi?: ReziApi;
  Me?: any;
  State: string = 'Loading';
  ErrorMessage: string = '';
  @Input() init: AppInit;

  constructor() {
    this.State = 'Loading';
  }

  ngOnInit(): void {
    console.log("The Rezi App did mount!");

    this.ReziApi = new ReziApi(this.init.apiUrl, this.init.token, this.init.refresh);


    if (this.ReziApi) {

      this.ReziApi.CheckAppEnabled(this.init.AppName, this.init.Level).then((enabled: Boolean) => {
        if (enabled || !enabled) { //whether it must be enabled or disabled, should be agreed with dezrez 
          this.ReziApi.Me().then((response: AxiosResponse) => {
            this.Me = response.data;
            this.State = 'Default';
          }).catch((err: AxiosError) => {
            this.HandleApiError(err);
          });
        } else {
          this.State = "Disabled";
        }
      }).catch((err: AxiosError) => {
        this.HandleApiError(err);
      });

    }
  }

  GoBack() {
    this.State = "Default";
  }

  //show the settings for a widget if they have any
  //you can hide or show the cog icon for settings using HasSetup in ReziActionAppWrapperComponent
  ShowSettings() {
    this.State = "Settings";
  }

  //change view when the widget changes height
  expanded = (height: number) => {

  }

  //change view when the widget changes height
  contracted = (height: number) => {

  }

  //do something with an external save command for example
  externalCommand = (command: any) => {

  }

  HandleApiError(err: any) {
    let errmsg = "";
    if (err.data && err.data.MessageDetail) {
      errmsg = err.data.MessageDetail;
    } if (err.message) {
      errmsg = err.message;
    }
    console.error(errmsg);
    this.State = 'Error';
    this.ErrorMessage = errmsg;
  }

}
