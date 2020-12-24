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
import { PieceCategoryWithRelations } from './pieceCategoryWithRelations';


/**
 * (tsType: PieceSubCategoryWithRelations, schemaOptions: { includeRelations: true })
 */
export interface PieceSubCategoryWithRelations { 
  [key: string]: object | any;


    /**
     * Piece sub category indentifier
     */
    id?: string;
    /**
     * Piece sub category name
     */
    name: string;
    pieceCategoryId?: string;
    pieceCategory?: PieceCategoryWithRelations;
}

