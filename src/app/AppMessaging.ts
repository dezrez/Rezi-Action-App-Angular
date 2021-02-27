import { ContainerSetup } from './DataContracts/BaseModules';

export const AppMessaging = (containerSetup: ContainerSetup, appStartCallback: any, expandedCallback: any, contractedCallback: any, externalCommandCallback: any, showSettingsCallback: any) => {

    //==============================================================
    //THIS FUNCTION RECEIVES EXPECTED MESSAGES AND PROCESSES THEM
    //YOU CAN ISSUE EVENTS TO THE PARENT TOO, FOR EXAMPLE
    //        window.parent.postMessage({ messageType: "navigate_new_tab", widgetid: id, message: { url: this.authUrl().Url } }, "*");
    //        THIS WILL OPEN A NEW TAB IN THE BROWSER WITH THE URL iSSUED, USEFUL FOR AUTHORIZATION FLOWS 
    //        window.parent.postMessage({ messageType: "navigate", widgetid: id, message: { url: this.authUrl().Url } }, "*");
    //        THIS WILL NAVIGATE FRAME WITH THE URL iSSUED 

    //
    document.addEventListener("readystatechange", (event: any): void => {
        if (document.readyState === "complete") {

            window.addEventListener("message", (event: any): void => {

                console.log(`Message Received By ${document.title}`);
                if (event.origin.indexOf(".dezrez.com") < 0) {
                    console.error(`Message doesn't come from a reliable source ${event.origin}\n${JSON.stringify(event, null, 4)}`);
                    return;
                }

                if (event.data.messageType) {
                    switch (event.data.messageType) {
                        case "start":
                            appStartCallback(event.data.token, event.data.refresh, event.data.apiUrl, event.data.context);
                            break;
                        case "expanded":
                            console.log(`Expanded to: ${event.data.height}`);
                            expandedCallback(event.data.height);
                            break;
                        case "settings":
                            console.log(`SHOW Settings`);
                            showSettingsCallback();
                            break;
                            case "contracted":
                            console.log(`Contracted to: ${event.data.height}`);
                            contractedCallback(event.data.height);
                            break;
                        case "externalCommand":
                            console.log(`ExternalCommand \n ${JSON.stringify(event.data.command)}`);
                            externalCommandCallback(event.data.command);
                            break;
                        default:
                            console.error(`Unexpected Message: ${event.data.messageType}`);

                    }
                } else {
                    console.error(`Badly Formatted Message: ${JSON.stringify(event, null, 4)}`);
                }

            });
            //when the widget document has loaded properly, send the message to say it has loaded
            //so that we can receive the token via the message system start command
            //you can specify the contracted and expanded heights of the widget here.
            
            window.parent.postMessage({ messageType: "widget_ready", widgetid: containerSetup.WidgetId, containerid: containerSetup.ContainerId, contractedHeight: containerSetup.ContractedHeight, expandedHeight: containerSetup.ExpandedHeight, hasSetup: containerSetup.HasSetup, supportEmail: containerSetup.SupportEmail, supportTel: containerSetup.SupportTel, supportUrl: containerSetup.SupportUrl }, "*");
        }

    });



};



