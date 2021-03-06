
export class AppInit {
  public widgetId: number; 
  public containerId: string; 
  public AppName: string; 
  public AppTitle: string; 
  public token: string; 
  public refresh: string; 
  public apiUrl: string; 
  public Level: string; 
  public SupportEmail: string; 
  public SupportTel: string;
  public SupportUrl: string;
  public HasSetup: boolean;
  public Context: any
  constructor(widgetId: number, containerId: string, AppName: string, AppTitle: string, token: string, refresh: string, apiUrl: string, Level: string, SupportEmail: string, SupportTel: string, SupportUrl: string, HasSetup: boolean, Context: any){
    this.widgetId = widgetId;
    this.containerId = containerId;
    this.AppName = AppName;
    this.AppTitle = AppTitle;
    this.token = token;
    this.refresh = refresh;
    this.apiUrl = apiUrl;
    this.Level = Level;
    this.SupportEmail = SupportEmail;
    this.SupportTel = SupportTel;
    this.SupportUrl = SupportUrl;
    this.HasSetup = HasSetup;
    this.Context = Context;
  }
  
}
