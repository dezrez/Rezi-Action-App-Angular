import { Component, Input, OnInit } from '@angular/core';
import { AppInit } from '../AppInit';
import ReziApi from '../Xhr/ReziApi'
import Axios, { AxiosResponse } from 'axios';

@Component({
  selector: 'app-rezi-action-app',
  templateUrl: './rezi-action-app.component.html',
  styleUrls: ['./rezi-action-app.component.css']
})
export class ReziActionAppComponent implements OnInit {
  ReziApi?: ReziApi;
  Me?: any;
  State: string = 'loading';
  ErrorMessage: string = '';
  @Input() init: AppInit;

  constructor() {

  }



  ngOnInit(): void {
    console.log("The Rezi App did mount!");

    this.ReziApi = new ReziApi(this.init.apiUrl, this.init.token, this.init.refresh);


    if (this.ReziApi) {

      this.ReziApi.CheckAppEnabled(this.init.AppName, this.init.Level).then((enabled: Boolean) => {
        if (enabled) {
          this.ReziApi.Me().then((response: AxiosResponse) => {
            this.Me = response.data;
            this.State = 'Loaded';
          }).catch((err) => {
            let errmsg = "";
            if (err.data && err.data.MessageDetail) {
              errmsg = err.data.MessageDetail;
            } if (err.message) {
              errmsg = err.message;
            }
            console.error(errmsg);
            this.State = 'Error';
            this.ErrorMessage = errmsg;
            

          });
        } else{
          this.State = "Disabled";
        }
      }).catch((err) => {
        let errmsg = "";
        if (err.data && err.data.MessageDetail) {
          errmsg = err.data.MessageDetail;
        } if (err.message) {
          errmsg = err.message;
        }
        console.error(errmsg);
        this.State = 'Error';
        this.ErrorMessage = errmsg;
      });

    }
  }

}
