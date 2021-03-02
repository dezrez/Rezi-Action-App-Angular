/*YOU CAN ADD NEW FUNCTIONS TO THIS FILE, BUT DO NOT REMOVE EXISTING ONES*/
import Axios, * as axio from "axios";
import { ReziAxios } from "./AxiosInstance"
import { ExternalApiCall } from "../DataContracts/BaseModules";


export default class ReziApi {

    instance: axio.AxiosInstance;

    constructor(apiUrl: string, token: string, refresh: string) {
        const RA = new ReziAxios(apiUrl, token, refresh);
        this.instance = RA.getInstance();

    }

    //check the app is enabled at both app and pro/premium/enterprise levels
    public CheckAppEnabled(AppName: string, Level: string) : Promise<boolean> {
        let calls: Promise<axio.AxiosResponse<any>>[] = [];
        calls.push(this.instance.get(`featuretoggling/${AppName}/enabled`));
        if (Level && Level !== null) {
            calls.push(this.instance.get(`featuretoggling/${Level}/enabled`));
        }
        return new Promise((resolve, reject)=>{
            Axios.all(calls).then((responses)=>{
                let level = true;
                const app:boolean = responses[0].data;
                if(responses.length>1) level = responses[1].data;
                resolve(level && app);
            }).catch((err)=>{
                reject(err);
            });
            
        })
       
    };

    //get the widget settings stored as a json string on the server
    public GetWidgetSettings(widgetId: number): Promise<axio.AxiosResponse<any>> {
        return this.instance.get(`app/setting/${widgetId}/widget`);     
    };

    //save the widget settings stored as a json string on the server
    public SaveWidgetSettings(widgetId: number, settings: any):  Promise<axio.AxiosResponse<any>> {
        const settingsContainer = {
            //AppId will be overwridden by the setting for the widget inside the api
            JSON: JSON.stringify(settings)
        };
           
        return this.instance.post(`app/setting/${widgetId}/widget`, settingsContainer);
    };

    //get all the apps that are widget Compatible
    public GetWidgetApps(): Promise<axio.AxiosResponse<any>> {
        return this.instance.get("app/widgetcompatible");
    };

    //get an enum of type
    public GetEnums(enumName: string): Promise<axio.AxiosResponse<any>> {
        return this.instance.get(`enum?typeName=${enumName}`);
    };

    //get an enlisted feature for an agency
    public GetEnlistedFeatures() : Promise<axio.AxiosResponse<any>>{
        return this.instance.get(`enlistedfeature/getvalidforagency`);
    };

 
    //set flags for a group
    public SetFlags(groupId: number, data: any): Promise<axio.AxiosResponse<any>> {
        return this.instance.put(`group/${groupId}/setflags`, data);
    };

    //save additional questions for a group
    public SaveAdditionalQuestions(groupId: number, data: any): Promise<axio.AxiosResponse<any>> {
        return this.instance.put(`group/${groupId}/saveadditionalquestions`, data);
    };

    //get the logged in negotiator
    public Me(): Promise<axio.AxiosResponse<any>> {
        return this.instance.get(`negotiator/me`);
    };

    //lookup the addresses for a postcode
    public LookupAddressesForPostcode(postcode: string): Promise<axio.AxiosResponse<any>> {
        return this.instance.get(`property/suggest?pageSize=999&query=${encodeURI(postcode)}&suggestType=All`);
    };
    
    //get a group
    public GetGroup(groupId: number): Promise<axio.AxiosResponse<any>>{
        return this.instance.get(`group/${groupId}`);  
    }

    //get a group
    public GetProperty(propertyId: number): Promise<axio.AxiosResponse<any>>{
        return this.instance.get(`property/${propertyId}`);  
    }
    
    //sent a request to the external provider api for this app
    //the data has the authetication attached server side and is relayed to the other api
    public ProxyCall(provider: string, call: ExternalApiCall):  Promise<axio.AxiosResponse<any>>{
        return this.instance.post(`app/endpoint/${provider}`, call);
    }


       //recored a referral against a groud
    public GetBranch(branchId: number): Promise<axio.AxiosResponse<any>>{
        return this.instance.get(`branch/${branchId}`);       
    }
   

}
