import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppMessaging } from "./AppMessaging";
import { AppInit } from './AppInit';
import { ContainerSetup } from './DataContracts/BaseModules';
import { ReziActionAppComponent } from './rezi-action-app/rezi-action-app.component';


@Component({
  selector: 'app-root',
  templateUrl: './rezi-action-app-wrapper.component.html',
  styleUrls: ['./rezi-action-app-wrapper.component.css']
})
export class ReziActionAppWrapperComponent implements OnInit {
  public Loading: boolean = true;
  public AppInit: AppInit = null;
  public ShowSetting: boolean = false;
  private AppName: string = "SOMESPECIALNAME";
  public AppTitle: string = "Your App Title";
  public SupportEmail: string = "yourname@yourdomain.com";
  public SupportTel: string = "07007 007007";
  public SupportUrl: string = "http://www.yourdomain.com/";
  private HasSetup: boolean = true;
  private ContractedHeight: number = 2;
  private ExpandedHeight: number = 2;
  private Level: string = null;
  private widgetId: number;
  private containerId: string;
  @ViewChild('ReziActionApp') ReziActionApp: ReziActionAppComponent;

  constructor(private route: ActivatedRoute) {
    this.Loading = true;
  }

  ngOnInit(): void {


    if (this.route && this.route.queryParams) {
      this.route.queryParams.subscribe((queryParams) => {
        const widgetId: number = parseInt(queryParams['WidgetId'] || queryParams['widgetId']) || null;
        if (widgetId && widgetId > 0) {
          this.widgetId = widgetId;
          console.log(this.widgetId);

        }

        const containerId: string = queryParams['ContainerId'] || queryParams['containerId'] || null;
        if (containerId && containerId.length > 0) {
          this.containerId = containerId;
          console.log(this.containerId);

        }
        if (this.containerId || this.widgetId) {
          const containerSetup: ContainerSetup = {
            WidgetId: this.widgetId,
            ContainerId: this.containerId,
            ExpandedHeight: this.ExpandedHeight,
            ContractedHeight: this.ContractedHeight,
            HasSetup: this.HasSetup,
            SupportEmail: this.SupportEmail,
            SupportTel: this.SupportTel,
            SupportUrl: this.SupportUrl

          };
          AppMessaging(containerSetup, this.startApp, this.expanded, this.contracted, this.externalCommand, this.showSettings);
        }
      });
    }

  }

  startApp = (token: string, refresh: string, apiUrl: string, context: any) => {
    console.log("App Was started By IFrame Container");
    this.Loading = false;
    this.AppInit = new AppInit(this.widgetId, this.containerId, this.AppName, this.AppTitle, token, refresh, apiUrl, this.Level, this.SupportEmail, this.SupportTel, this.SupportUrl, this.HasSetup, context);

  }

  //change view when the widget changes height
  expanded = (height: number) => {
    this.ReziActionApp.expanded(height);
  }
  //change view when the widget changes height
  contracted = (height: number) => {
    this.ReziActionApp.contracted(height);
  }
  //do something with an external save command for example
  externalCommand = (command: any) => {
    this.ReziActionApp.externalCommand(command);
  }

  //show the settings for a widget if they have any
  //you can hide or show the cog icon for settings using HasSetup in ReziActionAppWrapperComponent
  showSettings = () => {

    this.ReziActionApp.ShowSettings();
  }



}
