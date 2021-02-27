/*ADD TO THIS FILE*/
export class ExternalApiCall {
    /// <summary>
    /// This is the Base Entity Id of the object with a setting, that holds the setting for the auth object
    /// it can be either, Agency, Branch, Brand or Person, Determined by the External Provider Settings
    /// </summary>
    public AuthId?:number
    
    /// <summary>
    /// GET,PUT,POST,PATCH,DELETE
    /// </summary>
    public Method: string;
 
 
 
    /// <summary>
    /// QueryString Appened to the baseUrl stored for the external provider
    /// </summary>
    public  QueryString: string
 
    /// <summary>
    /// The serialised data contract (if any) being sent the other api 
    /// </summary>
    public Data?: string

    /// <summary>
    /// Defaults to 10 if not supplied
    /// </summary>
    public TimeOutSeconds?:  number;

    constructor(method: string, queryString: string, data?:string){
        this.Method = method;
        this.QueryString = queryString;
        this.Data = data;
    }
 
 }

 export class ContainerSetup {
    WidgetId: number;
    ContainerId: string;
    ContractedHeight: number;
    ExpandedHeight: number;
    HasSetup: boolean;
    SupportEmail: string;
    SupportTel: string;
    SupportUrl: string;
}