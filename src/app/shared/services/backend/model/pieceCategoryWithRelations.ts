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
import { PieceFamilyWithRelations } from './pieceFamilyWithRelations';


/**
 * (tsType: PieceCategoryWithRelations, schemaOptions: { includeRelations: true })
 */
export interface PieceCategoryWithRelations { 
  [key: string]: object | any;


    /**
     * Piece category indentifier
     */
    id?: string;
    /**
     * Piece category name
     */
    name: string;
    pieceFamilyId?: string;
    pieceFamily?: PieceFamilyWithRelations;
}
