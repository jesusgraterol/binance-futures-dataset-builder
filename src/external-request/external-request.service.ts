import * as http from "http";
import * as https from "https";
import {
    IExternalRequestService,
    IExternalRequestProtocolName, 
    IExternalRequestResponse, 
    IExternalRequestOptions 
} from "./interfaces";


export class ExternalRequestService implements IExternalRequestService {


    /**
     * The maximum amount of time a request can go for. An error is thrown
     * if the request takes longer than this value. A custom timeout can be 
     * specified in the options object.
     */
    private readonly request_timeout: number = 180 * 1000; // 3 minutes



    constructor() {

    }



    

    /**
     * Performs an HTTP/HTTPS based on provided parameters. The final response must be reviewed
     * as it can include errors thrown by the request recipient.
     * @param options 
     * @param params 
     * @param protocol_name 
     * @returns Promise<IExternalRequestResponse>
     */
    public request(
        options: IExternalRequestOptions, 
        params?: any, 
        protocol_name?: IExternalRequestProtocolName
    ): Promise<IExternalRequestResponse> {
        return new Promise((resolve, reject) => {
            // Init the protocol to be used
            const protocol: any = protocol_name == "http" ? http: https;

            // Check if a request timeout has been set
            if (typeof options.timeout != "number") options.timeout = this.request_timeout;

            // Perform the request
            let request: http.ClientRequest = protocol.request(options, (response: http.IncomingMessage) => {
                // Init response data
                let data: string = "";
                let final_response: IExternalRequestResponse = {
                    status_code: response.statusCode,
                    headers: response.headers
                };

                // On data changes
                response.on("data",  (chunk)=> {
                    data += chunk;
                });

                // Once it ends
                response.on("end",  () => {
                    // Verify if data was included
                    if (!data) {
                        resolve(final_response);
                    } else {
                        try {
                            final_response.data = JSON.parse(data);
                            resolve(final_response);
                        }catch(err) {
                            final_response.data = data;
                            resolve(final_response);
                        }
                    }
                });

                // If there is an error
                response.on("error",(err) => { reject(err) })
            });

            // Append params if applicable
            const final_params: string|undefined = this.get_final_params(params);
            if (final_params != undefined) request.write(final_params);

            // End request
            request.end();
        });
    }








    /**
     * Given the params, it will attempt to convert it into a valid string based on 
     * the format
     * @param params 
     * @returns string|undefined
     */
    private get_final_params(params?: any): string|undefined {
        // None provided
        if (!params) { return undefined }

        // String Param
        else if (typeof params == "string") { return params }

        // Object Param
        else if (typeof params == "object") { return JSON.stringify(params) }

        // Unknown format
        else { return String(params) }
    }
}