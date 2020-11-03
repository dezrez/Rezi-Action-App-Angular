import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { AppMessaging } from "./AppMessaging";
import { AppInit } from './AppInit';


@Component({
  selector: 'app-root',
  templateUrl: './rezi-action-app-wrapper.component.html',
  styleUrls: ['./rezi-action-app-wrapper.component.css']
})
export class ReziActionAppWrapperComponent implements OnInit {
  public Loading: boolean = true;
  public AppInit: AppInit = null;
  private AppName : string = "COVIDCHECKER";
  public AppTitle : string = "Lock Down Status";
  public SupportEmail : string = "ian.pearce@dezrez.com";
  public SupportTel : string = "01792 610000";
  private ContractedHeight : number = 2;
  private ExpandedHeight: number = 2;
  private Level : string  = null;
  private widgetId: number;
  private containerId: string;

  constructor(private route: ActivatedRoute) { 
   
  }

  ngOnInit(): void {
    if (this.route && this.route.queryParams) {
      this.route.queryParams.subscribe((queryParams) => {
        const widgetId: number = parseInt(queryParams['WidgetId'] || queryParams['widgetId']) || null;
        if(widgetId && widgetId>0){
          this.widgetId = widgetId;
          console.log(this.widgetId);
          
        }

        const containerId: string = queryParams['ContainerId'] || queryParams['containerId'] || null;
        if(containerId && containerId.length > 0 ){
          this.containerId = containerId;
          console.log(this.containerId);
          
        }
        if(this.containerId || this.widgetId){
          AppMessaging(this.widgetId, this.containerId, this.ContractedHeight, this.ExpandedHeight, this.startApp, this.expanded, this.contracted, this.externalCommand);
        }
      });
    }
    
  }

  startApp = (token: string, refresh: string, apiUrl: string, context: any) => {
    console.log("App Was started By IFrame Container");
    this.Loading = false;
    this.AppInit = new AppInit(this.widgetId, this.containerId, this.AppName, this.AppTitle, token, refresh, apiUrl, this.Level, this.SupportEmail, this.SupportTel, context);
  
  }

  expanded = (height: number) => {

  }

  contracted = (height: number) => {

  }

  externalCommand = (command: any) => {

  }

}
