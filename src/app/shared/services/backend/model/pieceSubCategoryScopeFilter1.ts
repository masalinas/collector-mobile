/**
 * collector-api
 * Where collector lives
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface PieceSubCategoryScopeFilter1 { 
    offset?: number;
    limit?: number;
    skip?: number;
    order?: string | Array<string>;
    where?: { [key: string]: object; };
    fields?: any | Array<string>;
    include?: Array<{ [key: string]: object; }>;
}
