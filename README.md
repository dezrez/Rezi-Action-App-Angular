# Introduction

Rezi has been developed completely on an open REST API. Authentication is taken care of using OAuth2.0, this should allow for external companies to securely access data and resources held in the Rezi system.

Rezi is the place where most agents spend the majority of their time, as it enables most of their day to day activities and rather than moving from web page to web page, or program to program, it would make sense to offer the services of external systems within Rezi. Simplifying the agents day to day life.

Some integration work could be achieved by directly using the API to push and pull data to/from other services such as (but not exclusively) zapier.com and bubble.io. However, these behind the scenes integrations could not surface external information within Rezi as there is no placeholder in rezi to receive it. The new platform, allows external companies to use independently write &quot;apps&quot; for integration into Rezi. The platform is completely framework agnostic, but gives access to the API as if you are the logged in user. With this in mind there will be an [approval](#_Approval) process for accepting the apps that is governed by Dezrez, including API usage and styles. This is purely to prevent unsympathetic API usage and a clash in UI [style](#_Styling).

These Apps show the true power of the Rezi Open API.

The Apps can reside in 4 different main areas.

- Dashboard Widgets (have no context, but do have settings)
- Actions Menus (any property/group hub)
- Extraction Points for referral (property instruction, accept an offer etc.)
- Common Registration Dialogs (book a valuation, book a viewing, add a client etc.)

The apps have access to the entire API, any entity can be created, read, updated or deleted. Special endpoints have been added, to allow the attachment of metadata to certain entities in Rezi, and the addition of custom fields also. These custom fields can be extracted in both the API and mailed out using Rezi Post. Dashboard widgets, have private settings per instance, allowing you to save a particular setup/filter etc. for a widget. Furthermore, the apps have access to an endpoint to proxy calls to other authenticated REST APIs (if hiding the authentication token is required, or the authentication is on a per agency basis). For the App developer, this simplifies the process of having to deal with 2 authentication systems, as the proxy call to our API, is authenticated by the same token as the rest of our API. In addition, Oauth2.0 and Oauth1.0a flows can be initiated from the apps, and the refresh tokens are stored in our db, for future bearer token creation.

The apps can be written in anything that can create a website, having said that they must be able to receive the [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) calls. So far we have created apps using, vanilla javascript/typescript with and without webpack, React, Angular and even the no code option of Bubble.io . Examples are available on request, but will shortly be available on our github page.

This is an example of a dashboard widget (context-less) that gets agents data directly from google analytics via their api (it has configurable settings, hence the cog icon at the top right)

![Google Analytics](https://rezi-apps.dezrez.com/rezi/Content/Images/ReadMe/Google.png)

These are examples of action apps, that appear in context within the property hub.

What 3 words

 ![](https://rezi-apps.dezrez.com/rezi/Content/Images/ReadMe/w3w.png) 

Integration with gov.uk EPC API

 ![](https://rezi-apps.dezrez.com/rezi/Content/Images/ReadMe/EPC.png)

# Methodology

The basis of the integration points is iframes, the URL of the hosted app is held within the Rezi database and is not accessible via the API, so cannot be changed by the app developer without consultation with Dezrez. Dezrez can and will control all of the iframe [sandbox settings](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) to allow only the required services to be enabled.

An &quot;App&quot; is simply a website hosted by us, or on another verified and authorised domain. Communication between Rezi and the App is done via [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and all messages are verified and controlled against their domain. The messages allowed are controlled, and the structure of those messages is also controlled. Failure to meet any of these requirements will simply mean that these messages are ignored.

![](https://rezi-apps.dezrez.com/rezi/Content/Images/ReadMe/Operation.png)

With the exception of Dashboard widgets, the app will be passed whatever context is available. This allows further querying of the API, to obtain any piece of relevant information. This may be a GroupRole for example, which would allow you to make calls to obtain telephone numbers, and any other piece of information. For a PropertySalesRole, you could get all of the offer prices and whether they were accepted, for example.

The app also gets passed either a unique WidgetId (if a dashboard widget) or a container id. The widget id gives you access to private settings for that widget, which can be stored as json on our system and retrieved on initial load. The container id, solely ensures that communications via postMessage are destined for the correct iframes, it should be held in memory for communication back to the Rezi SPA

# Requirements

- A license agreement to be signed, to pass on any downstream GDPR responsibility to the App Author
- The app code will need to be submitted reviewed before deployment.
- The domain from which the app is served must stay constant.
- The protocol above for initiation of the app must be followed.
- The provided stylesheet must be used for standard UI items such as input boxes, text, labels, tabs etc.
- The initial document served must contain javascript to handle the window.postMessage protocol for start-up. However, consequently, that could do form posts or anything that a normal webpage would do.
- Must be served by https only
- You must make sure that any caught exceptions, show an error page that explains the error, and shows the author (other their support)&#39;s email address and telephone number. Rezi will not directly support issues in these apps.
- The should show a loading icon (style provided) whilst the iframe postMessage communication is going on, including the app title.
- You should provide details of whether it is an widget, an action menu item (and what context to show it in), a extraction engine (and what context to show it in), or a global action.
- You must provide a icon for the action menu, that is white on transparent background of svg format.
- If the app is a widget, you should provide an icon for the app 40x40px in either png or jpg format.

# Start Up Negotiation

The iframe url to the app is initiated with some extra parameters. In the case of a context-less dashboard widget it will be passed the rezi widget id (long integer). In the case of context aware actions it will be passed the containerId (a guid).

Step 1) Obtain widgetId or containerId from the url parameters.

Step 2) As soon as the document.readyState is &quot;complete&quot; create an event listener to listen for &quot;message&quot; events. Within that listener you must check that the origin from &quot;dezrez.com&quot;, and reject the message if it is not. All messages from the Rezi SPA will have the messageType property, this will indicate what you should do with this message.

Step 3) When you have created the listener, you should send the following window.postMessage

```
{
	messageType: "widget_ready",
	widgetid: (number, obtained from step 1 or null),
	containerid: (string, obtained step 1 or null),
	contractedHeight: (number, hard coded widget height, 1-3),
	expandedHeight: (number, hard coded widget height, 1-3),
	hasSetup: (boolean, does the widget have a settings screen),
	supportEmail: (string, the email address to contact for support),
	supportTel: (string, the telephone number to contact for support),
	supportUrl: (string, the support url, could be for ticket creation)
}

```

Step 4) You will then receive message from the Rezi SPA similar the following format.

```
{
	"messageType": "start",
	"token": "eyJ0eXAiOiJKV1-blah-blah",
	"refresh": "4ea5a316ebf541f7a81",
	"context": {
		"ActionMenu": {
			"Flag": 1
		},
		"PropertySalesRoleDetails": { See Contexts below....}
		},
		"ExtractionEngine": {
			"GroupId": 6761,
			"Flag": 8
		}
	},
	"apiUrl": "https://api.dezrez.com/api/"
}
```

Whether you receive context, depends on if you are writing an action app or a widget app. But when you receive the messageType &quot;start&quot;, you can now initialise the app. &quot;token&quot; (truncated here) is the bearer access token for the rezi api, see authentication below. &quot;refresh&quot; is the refresh token that can be used to get a new bearer access token, should the access token passed expire. apiUrl is the base rezi api url that you should use in subsequent calls to the api, removing the need to code for different environments.

# Authentication

Authentication with our API is simple, the app is passed a token from the Rezi SPA (detailed above), via a windows.postMessage from a known referrer along with a refresh token. The refresh token must not be stored by the app, but can be held in state during the app lifetime, in case it is necessary to renew an expired bearer token.

This token is passed in any api calls as an API authorization header bearer token. A second header of &quot;Rezi-Api-Version&quot;:&quot;1.0&quot; must also be passed in all calls.

# Other Messages

The SPA may send other messages to you, such as expand/contract the widget, or to tell you to show the settings menu, or a customizable external commands that can be initiated outside of the iframe, from buttons on modal dialogs for example.

- expanded: Applies solely to widgets: This indicates that that the user has requested that the user has requested the expanded view (see expandedHeight above), and you may want to show a different view in the new higher widget.
- contracted: Applies solely to widgets: This indicates that that the user has requested that the user has requested the contracted view (see contractedHeight above), and you may want to show a different view in the new shorter widget.
- settings: Applies solely to widgets: This indicates that the user has asked to see the settings for this widget, you should display that view.
- externalCommand: Applies solely to action apps: Action apps iframe are contained within modal dialog that can have an action button and a cancel button. External command can be listened to, to know that the action button has been pressed. A scenario is that the action button is marked &quot;Save&quot; and you would like to act on that button press.

To enable/disable this button you can send a postMessage in the format:

```
{
	messageType:”enableSave”,
	enable: true/false,
	containerId: the container id
}
```

And when the &quot;Save&quot; has succeeded, to close the modal dialog, issue a postMessage in the format:

```
{
   messageType:”saveSucceeded” ,
   containerId: the container id
}
```



# Useful API Endpoints

Whilst the entire API is accessible via the platform framework allowing you to do anything that rezi can do within your app, there are some key endpoints that can both give you ideas, and extend your functionality. Special endpoints have been added to enable you to store information for configuration or reference or much more.

As part of the negotiation process the base uri for the api will be passed in. So there is no need to code environment changes to point at our api, you can just use the apiUrl.

### SETTINGS ENDPOINT

Dashboard widgets (but not action apps) can store a json string against the widget Id (which is an instance id) so that the user can customise their experience.

##### Action: GET

Route: [app/setting/{widgetId:long}/](https://api.dezrez.com/app/metadata/%7Bentityid:long%7D/%7BappliesTo%7D)widget

Example: [app/setting/12323/](https://api.dezrez.com/app/metadata/%7Bentityid:long%7D/%7BappliesTo%7D?valuesNames=ReferenceId&amp;valuesNames=Name)widget

```
{
	"AppId": 19,
	"Json": "{\"NegIds\":[110,112],\"circle\":\"full\"}",
	"Id": 12323
}
```

##### Action: POST

Route: [app/setting/{widgetId:long}/](https://api.dezrez.com/app/metadata/%7Bentityid:long%7D/%7BappliesTo%7D)widget

Example: [app/setting/12323/](https://api.dezrez.com/app/metadata/%7Bentityid:long%7D/%7BappliesTo%7D?valuesNames=ReferenceId&amp;valuesNames=Name)widget

AppSettingsDataContract

| **Parameter** | **Length** | **Format** | **Mandatory** | **Notes** |
| --- | --- | --- | --- | --- |
| **Json** | 512 | string | Yes | The json string you wish to store |

```
{
	"AppId": 19,
	"Json": "{\"NegIds\":[110,112],\"circle\":\"full\"}",
	"Id": 12323
}
```

### METADATA ENDPOINT

Rezi allows the storage of metadata against entities, this can be useful for storing your reference id and looking for it as an app starts up to take you straight back to an actual order for example. The metadata fields can store a 512 length string against and entity, this could be whatever format is appropriate but probably json would be best in case you need to upgrade it.

To retrieve metadata values, you must supply the entityId of the entity, of type AppliesTo (for example &quot;PropertySalesRole&quot;, &quot;PropertyLettingsRole&quot;, &quot;GroupRole&quot;. Each of your metadata items must have a unique name, and we would suggest prepending the app name. Contact us if you have other requirements.

##### Action: GET

Route: [app/metadata/{entityid:long}/{appliesTo}](https://api.dezrez.com/app/metadata/%7Bentityid:long%7D/%7BappliesTo%7D)

Parameters: valuesNames;

Example: [app/metadata/1234/PropertySalesRole?valuesNames=ReferenceId&amp;valuesNames=Name](https://api.dezrez.com/app/metadata/%7Bentityid:long%7D/%7BappliesTo%7D?valuesNames=ReferenceId&amp;valuesNames=Name)

Response:

404: if no metadata was found with the name and the entity type, and the id.

Otherwise:

```
[
	{“ReferenceId”:”1231234”},
	{“Name”:”Ian Pearce”}
]
```

To add or update metadata values, supply them as a name value pair array.

##### Action: POST

Route: [app/metadata/upsert](https://api.dezrez.com/app/metadata/upsert)

UpsertMetaDataCommandDataContract

| **Parameter** | **Length** | **Format** | **Mandatory** | **Notes** |
| --- | --- | --- | --- | --- |
| **AppliesToSystemName** |
| string | Yes | PropertySalesRole etc |
| **EntityId** |
| Long | Yes | The id of the Entity |
| **Values** |
| Name Value Pair Array | Values have a max length of 512, Names 255 | [{&quot;Name1&quot;:&quot;value1&quot;},{&quot;Name2&quot;:&quot;value2&quot;}] |

Response:

the name value pairs saved.

```
[
	{“Name1”:”Value1”},
	{“Name2”:”Value2”}
]
```

### CUSTOM FIELD ENDPOINTS

Custom fields can be created within rezi and attached to entities. These are marginally different from metadata in both their execution and intended use. Whilst metadata is useful for storing external ids or settings, to preserve state etc, custom fields are used to create data that can be distributed to clients out via rezi post text/email/pdf and signable. They are also visible through rezi&#39;s simple web gateway and can be consumed or made visible via agents websites.

There is also information about the type of field, and what type of control should be used to make changes to the value. This can be very useful, if you want have an app that needs to expose something like a url, or a specialist value, drop downs etc. The value is visible in the rezi hubs, like this…

![](https://rezi-apps.dezrez.com/rezi/Content/Images/ReadMe/CustomFields.png)

##### Action: GET

Route: [app/customfield/{entityId:long}/{customFieldGroupName}/{appliesTo}](https://api.dezrez.com/customfield/%7BentityId:long%7D/%7BcustomFieldGroupName%7D/%7BappliesTo%7D)

Parameters: customFieldNames;

Example: [app/customfield/12345/What3Words/](https://api.dezrez.com/customfield/12345/What3Words/)PropertySalesRole?customFieldsNames=Position%20Of%20Front%20Door&amp;customFieldsNames=Position%20Of%20Board

Response:

404: if no custom fields were found with that group or field name matching that id, for that entity, and the id.

Otherwise:

```
[{
	"Type": {
		"Id": 214,
		"Name": "String",
		"SystemName": "String"
	},
	"Name": "Position Of Front Door",
	"Value": "live.backed.purifier"
}, {
	"Type": {
		"Id": 214,
		"Name": "String",
		"SystemName": "String"
	},
	"Name": "Position Of Board",
	"Value": "daylight.carefully.spouting"
}]
```

##### Action: POST

Route: [app/customfields/upsert](https://api.dezrez.com/app/customfields/upsert)

UpsertCustomGroupFieldValuesCommandDataContract

| **Parameter** | **Length** | **Format** | **Mandatory** | **Notes** |
| --- | --- | --- | --- | --- |
| **GroupName** |
| string | Yes | The CustomFieldGroupName |
| **AppliesToSystemName** |
| string | Yes | PropertySalesRole etc |
| **EntityId** |
| Long | Yes | The id of the Entity |
| **Fields** |
| [UpsertCustomFieldValueDataContract](#UpsertCustomFieldValueDataContract)Array | Yes | See data contract below |

UpsertCustomFieldValueDataContract

| **Parameter** | **Length** | **Format** | **Mandatory** | **Notes** |
| --- | --- | --- | --- | --- |
| **TypeSystemName** |
| string | Yes | The CustomFieldGroupName |
| **ControlTypeSystemName** |
| string | Yes | Checkbox, CheckboxList, RadioButtonList, TextBox, TextArea or Select |
| **Name** |
| String | Yes | The id of the Entity |
| **Validator** |
| String | No | Not used |
| **Options** |
| String [] | Depends on Control Type | List of strings that would be used to construct a list of options for the user to choose from in rezi image above, this would be for everything other than the TextBox and TextArea above. |
| **Value** |
| string | Yes |
 |

Response:

An array of the new values saved

```
[{
	"Type": {
		"Id": 214,
		"Name": "String",
		"SystemName": "String"
	},
	"Name": "Position Of Front Door",
	"Value": "live.backed.purifier"
}, {
	"Type": {
		"Id": 214,
		"Name": "String",
		"SystemName": "String"
	},
	"Name": "Position Of Board",
	"Value": "daylight.carefully.spouting"
}]
```



### PROXY ENDPOINT

This endpoint allows you to call pre-defined external endpoints. Calls are formed on the server side, using pre-defined authentication. This information must be supplied, we would need the authentication method, and the base url for example. This allows you to make calls to your api, without the need to deal with client side authentication, or exposing client secrets etc in javascript. Supported so far are…

- x-api-key
- bearer
- basic
- auth2
- url-param
- form-field

with the exception of oauth2, the authentication is sent server side over https using a static key, which you provide. Oauth2, allows much deeper authentication, using a client flow, the refresh token for a service can be stored against a negotiator, branch, brand or agency allowing you to choose the level of authentication. More details would be required to setup the authentication flow required to obtain the url necessary to initiate this flow. Endpoints are provided to initiate the authentication flow below.

The response from your endpoint, including exceptions is simply proxied through our api.

##### Action: POST

Route: app/endpoint/{provider}

ExternalProviderProxyRequestDataContract

| **Parameter** | **Length** | **Format** | **Mandatory** | **Notes** |
| --- | --- | --- | --- | --- |
| **BrandId** |
| long | No | The brand, if the authentication is attached to the brand |
| **Method** |
| string | Yes | GET, POST, PUT, DELETE, FORM |
| **QueryString** |
| String | Yes | The remaining part of the query string, the baseUrl would have been supplied during setup |
| **Data** |
| String | Depends on method | Serialised json data contract, this should be and array of {&quot;name&quot;:&quot;value&quot;} pairs for FORM. |
| **TimeOutSeconds** |
| int | No | Defaults to 10 |

Response:

This is your own servers response.

### AUTH URL ENDPOINTS

The following endpoints return the start of an authentication flow to retrieve a refresh token from your system. This depends on the appropriate client ids, client secrets and redirect urls being configured correctly for your system in the rezi config. When the redirect url is hit, the token provided by your system is stored in rezi and subsequently used in [proxy calls](#PROXYENDPOINT) to your endpoints. The provider string will be given to you by the team at rezi as part of the setup. Refresh tokens can be stored in such a way as to authorize a branch, a brand, an agency or an individual negotiator, this is purely down to your implementation and requirements.

##### Action: GET

Routes:

| Branch Association | app/auth/{provider}/url/{branchId:long}/branch |
| --- | --- |
| Brand Association | app/auth/{provider}/url/{brandId:long}/brand |
| Agency Association | app/auth/{provider}/url/agency |
| Negotiator Association | app/auth/{provider}/url/{personId:long}/person |

Response:

```
{
        “Url”: “https://SomeVeryLongAndComplexUrl”,
        “ExternalProviderEnabled”:true/false
}
```



### REPORTING ENDPOINT

Custom stored procedure queries can be written for you to bring back specific information, these stored procs can be executed using the reporting endpoint. These stored procs are coded server side to scope them to the agency. The branch can also be scoped from the detail contained within the rezi bearer token, so there is no need to provide this information, except where you want to query other branches as well. There is no defined json schema returned, it can be defined at the time that the stored procedure is written for you. If you tell us what schema you need the data in, we will author that for you. This is a chargeable service. NB, they can only be read only!

# Contexts

For Action apps, which appear from the context menus in Rezi we provide a data contract giving the context of the page you are on. From this data contract, you can extract further ids and information and further query our api on rezi to dig down further.

These data contracts are very comprehensive, and you may not need to make further requests to perform any actions you require. For example, I have included below a property sales role context:

Potential ids that you may wish to use to further query the api, end with "Id"

		"PropertySalesRoleDetails": {
			"Id": 14790,
			"CreatedDate": {
				"_isUtc": true,
				"_date": {
					"_useUTC": true,
					"_isUTC": true,
					"_i": "2014-08-20T10:21:52Z",
					"_f": "YYYY-MM-DDTHH:mm:ssZ",
					"_strict": false,
					"_pf": {
						"empty": false,
						"unusedTokens": [],
						"unusedInput": [],
						"overflow": -1,
						"charsLeftOver": 0,
						"nullInput": false,
						"invalidMonth": null,
						"invalidFormat": false,
						"userInvalidated": false,
						"iso": true
					},
					"_a": [2014, 7, 20, 10, 21, 52, 0],
					"_tzm": 0,
					"_d": "2014-08-20T10:21:52.000Z",
					"_ambigTime": false,
					"_ambigZone": false,
					"_offset": 0,
					"_lang": {
						"_abbr": "en",
						"_months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
						"_monthsShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
						"_weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
						"_weekdaysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
						"_weekdaysMin": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
						"_longDateFormat": {
							"LT": "h:mm A",
							"L": "MM/DD/YYYY",
							"LL": "MMMM D YYYY",
							"LLL": "MMMM D YYYY LT",
							"LLLL": "dddd, MMMM D YYYY LT",
							"l": "M/D/YYYY"
						},
						"_meridiemParse": {},
						"_calendar": {
							"sameDay": "[Today at] LT",
							"nextDay": "[Tomorrow at] LT",
							"nextWeek": "dddd [at] LT",
							"lastDay": "[Yesterday at] LT",
							"lastWeek": "[Last] dddd [at] LT",
							"sameElse": "L"
						},
						"_relativeTime": {
							"future": "in %s",
							"past": "%s ago",
							"s": "a few seconds",
							"m": "a minute",
							"mm": "%d minutes",
							"h": "an hour",
							"hh": "%d hours",
							"d": "a day",
							"dd": "%d days",
							"M": "a month",
							"MM": "%d months",
							"y": "a year",
							"yy": "%d years"
						},
						"_ordinal": "%d",
						"_week": {
							"dow": 0,
							"doy": 6
						},
						"_invalidDate": "Invalid date"
					}
				},
				"IsDateHelper": true,
				"__moduleId__": "helpers/DateHelper"
			},
			"CreatedBy": {
				"Id": 1,
				"Initials": null,
				"ContactName": "System Account",
				"Gender": {},
				"Title": null,
				"FirstName": "System Account",
				"LastName": null,
				"PrimaryTelephone": {
					"Type": {},
					"MarketingContactStatus": {}
				},
				"PrimaryEmail": {
					"Type": {},
					"MarketingContactStatus": {}
				},
				"JobTitle": null
			},
			"CustomFields": [{
				"Name": "what3words",
				"Values": [{
					"Type": {
						"Id": 214,
						"Name": "String",
						"SystemName": "String"
					},
					"Name": "Position Of Front Door",
					"Value": "live.backed.purifier"
				}, {
					"Type": {
						"Id": 214,
						"Name": "String",
						"SystemName": "String"
					},
					"Name": "Position Of Board",
					"Value": "daylight.carefully.spouting"
				}, {
					"Type": {
						"Id": 214,
						"Name": "String",
						"SystemName": "String"
					},
					"Name": "Where To Park",
					"Value": "decently.bars.referral"
				}, {
					"Type": {
						"Id": 214,
						"Name": "String",
						"SystemName": "String"
					},
					"Name": "Where not To Park",
					"Value": "stun.curvy.bashful"
				}, {
					"Type": {
						"Id": 214,
						"Name": "String",
						"SystemName": "String"
					},
					"Name": "Where Not To Park",
					"Value": "ledge.deciding.character"
				}]
			}],
			"OwningTeamId": 8401,
			"BranchId": 1,
			"Name": "Looking to sell ( The Paddock, BS16 9PD)",
			"TeamAccessType": null,
			"RoleType": {
				"Id": 613,
				"Name": "Selling",
				"SystemName": "Selling"
			},
			"RoleStatus": {
				"Id": 69,
				"Name": "Instruction to Sell",
				"SystemName": "InstructionToSell"
			},
			"GroupId": 6761,
			"DefaultPicture": {
				"CreatedDate": {
					"_isUtc": true,
					"IsDateHelper": true,
					"__moduleId__": "helpers/DateHelper"
				},
				"CreatedBy": {
					"Gender": {},
					"PrimaryTelephone": {
						"Type": {},
						"MarketingContactStatus": {}
					},
					"PrimaryEmail": {
						"Type": {},
						"MarketingContactStatus": {}
					}
				},
				"Tags": [],
				"DocumentType": {},
				"DocumentSubType": {},
				"ExpiryDate": {
					"_isUtc": true,
					"IsDateHelper": true,
					"__moduleId__": "helpers/DateHelper"
				}
			},
			"PropertyId": 124,
			"AgencyType": {
				"Id": 184,
				"Name": "Sole",
				"SystemName": "Sole"
			},
			"AgencyPeriod": {
				"Id": 163,
				"Name": "None",
				"SystemName": "None"
			},
			"ContractEndDate": {
				"_isUtc": true,
				"_date": {
					"_useUTC": true,
					"_isUTC": true,
					"_i": "0001-01-01T00:00:00Z",
					"_f": "YYYY-MM-DDTHH:mm:ssZ",
					"_strict": false,
					"_pf": {
						"empty": false,
						"unusedTokens": [],
						"unusedInput": [],
						"overflow": -1,
						"charsLeftOver": 0,
						"nullInput": false,
						"invalidMonth": null,
						"invalidFormat": false,
						"userInvalidated": false,
						"iso": true
					},
					"_a": [1, 0, 1, 0, 0, 0, 0],
					"_tzm": 0,
					"_d": "0001-01-01T00:00:00.000Z",
					"_ambigTime": false,
					"_ambigZone": false,
					"_offset": 0,
					"_lang": {
						"_abbr": "en",
						"_months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
						"_monthsShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
						"_weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
						"_weekdaysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
						"_weekdaysMin": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
						"_longDateFormat": {
							"LT": "h:mm A",
							"L": "MM/DD/YYYY",
							"LL": "MMMM D YYYY",
							"LLL": "MMMM D YYYY LT",
							"LLLL": "dddd, MMMM D YYYY LT",
							"l": "M/D/YYYY"
						},
						"_meridiemParse": {},
						"_calendar": {
							"sameDay": "[Today at] LT",
							"nextDay": "[Tomorrow at] LT",
							"nextWeek": "dddd [at] LT",
							"lastDay": "[Yesterday at] LT",
							"lastWeek": "[Last] dddd [at] LT",
							"sameElse": "L"
						},
						"_relativeTime": {
							"future": "in %s",
							"past": "%s ago",
							"s": "a few seconds",
							"m": "a minute",
							"mm": "%d minutes",
							"h": "an hour",
							"hh": "%d hours",
							"d": "a day",
							"dd": "%d days",
							"M": "a month",
							"MM": "%d months",
							"y": "a year",
							"yy": "%d years"
						},
						"_ordinal": "%d",
						"_week": {
							"dow": 0,
							"doy": 6
						},
						"_invalidDate": "Invalid date"
					}
				},
				"IsDateHelper": true,
				"__moduleId__": "helpers/DateHelper"
			},
			"Flags": [],
			"Price": {
				"Id": 123,
				"PriceValue": 675000,
				"CurrencyCode": "GBP",
				"PriceText": "",
				"PriceType": {
					"Id": 538,
					"Name": "Flat Price",
					"SystemName": "FlatPrice"
				},
				"PriceQualifierType": {}
			},
			"Fees": [],
			"OwningTeam": {
				"Id": 8401,
				"Name": "Ian Pearce",
				"Description": null
			},
			"Branch": {
				"Id": 1,
				"Name": "Chipping Sodbury",
				"LegalEntityId": 0,
				"VAT": null
			},
			"ValidEpcInPlace": false,
			"ProofOfIdReceived": false,
			"ProofOfOwnershipReceived": false,
			"ClosingDate": null,
			"MarketingStartDate": {
				"_isUtc": true,
				"_date": {
					"_useUTC": true,
					"_isUTC": true,
					"_i": "0001-01-01T00:00:00Z",
					"_f": "YYYY-MM-DDTHH:mm:ssZ",
					"_strict": false,
					"_pf": {
						"empty": false,
						"unusedTokens": [],
						"unusedInput": [],
						"overflow": -1,
						"charsLeftOver": 0,
						"nullInput": false,
						"invalidMonth": null,
						"invalidFormat": false,
						"userInvalidated": false,
						"iso": true
					},
					"_a": [1, 0, 1, 0, 0, 0, 0],
					"_tzm": 0,
					"_d": "0001-01-01T00:00:00.000Z",
					"_ambigTime": false,
					"_ambigZone": false,
					"_offset": 0,
					"_lang": {
						"_abbr": "en",
						"_months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
						"_monthsShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
						"_weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
						"_weekdaysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
						"_weekdaysMin": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
						"_longDateFormat": {
							"LT": "h:mm A",
							"L": "MM/DD/YYYY",
							"LL": "MMMM D YYYY",
							"LLL": "MMMM D YYYY LT",
							"LLLL": "dddd, MMMM D YYYY LT",
							"l": "M/D/YYYY"
						},
						"_meridiemParse": {},
						"_calendar": {
							"sameDay": "[Today at] LT",
							"nextDay": "[Tomorrow at] LT",
							"nextWeek": "dddd [at] LT",
							"lastDay": "[Yesterday at] LT",
							"lastWeek": "[Last] dddd [at] LT",
							"sameElse": "L"
						},
						"_relativeTime": {
							"future": "in %s",
							"past": "%s ago",
							"s": "a few seconds",
							"m": "a minute",
							"mm": "%d minutes",
							"h": "an hour",
							"hh": "%d hours",
							"d": "a day",
							"dd": "%d days",
							"M": "a month",
							"MM": "%d months",
							"y": "a year",
							"yy": "%d years"
						},
						"_ordinal": "%d",
						"_week": {
							"dow": 0,
							"doy": 6
						},
						"_invalidDate": "Invalid date"
					}
				},
				"IsDateHelper": true,
				"__moduleId__": "helpers/DateHelper"
			},
			"PurchasingRoleId": null,
			"ExchangedPriceDataContract": {},
			"OfferAcceptedPriceDataContract": {},
			"CurrentFee": null,
			"NumberOfBathrooms": 0,
			"NumberOfBedrooms": 0,
			"NumberOfReceptionRooms": 0,
			"SelectedImageUrl": null,
			"StatusName": "INSTRUCTION TO SELL",
			"StatusType": "InstructionToSell",
			"Commission": 0,
			"__moduleId__": "models/BaseModuleWrappers/Roles/PropertySalesRoleDataContract"
		}
# Development and Debugging

Development of apps is simple, if you tell us your application host we will create one inside rezi systest. So for example if you wish to develop on angular which has a default of [https://localhost:4200/](https://localhost:4200/) we will create an host widget or app for you, to host the development environment on your machine. This will be passed all of the same window.postMessage messages, tokens, and context, so that you can start to dig into the application development very quickly.

We have example starter kits in typescript for base javascript with webpack, angular and react available on request.

# Styling

Apps may be branded, subject to approval, but must use our styles/colours so that they applications do not Jar with the user

[https://www.figma.com/proto/gkk8GGnjKDp9D0AhsSMlhF/Dashboard?node-id=319%3A4263&amp;viewport=490%2C-124%2C1.019605278968811&amp;scaling=scale-down-width](https://www.figma.com/proto/gkk8GGnjKDp9D0AhsSMlhF/Dashboard?node-id=319%3A4263&amp;viewport=490%2C-124%2C1.019605278968811&amp;scaling=scale-down-width)

# Approval

We will require to see the code running for the app, this is purely to see if there is any danger of your app abusing our API. On approval, the app will be released to clients in a staged released, choosing a few targeted agents first. Subsequent to that the role out will be subject to any arrangements made with the commercial team.