import * as http from "http";


// Service
export interface IExternalRequestService {
    request(
        options: IExternalRequestOptions, 
        params?: any, 
        protocol_name?: IExternalRequestProtocolName
    ): Promise<IExternalRequestResponse>
}


// Options
export type IExternalRequestOptions = http.RequestOptions;

// Response
export interface IExternalRequestResponse {
    status_code: number|undefined,
    headers: http.IncomingHttpHeaders,
    data?: any
};

// Protocol
export type IExternalRequestProtocolName = "http"|"https";