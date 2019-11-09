import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";

/* 
    Fact
*/

export interface IFactBase {
  ComponentGUID: string;
  JobGUID: string;
  isResource: boolean;
  value: number;
  uploadedAt: Date;
  Comment?: string | null;
  Mark?: number | null;
  UserGUID: string;
}

export interface IFact extends IFactBase, IBaseInstanceInfo {}

export type IFactInstance = Sequelize.Instance<IFact> & IFact;

export interface IFactGetParams {
  ComponentGUID: string;
}

export interface IFactGetResponse {
  JobFacts: IFact[];
  ResourceFacts: IFact[];
}

export interface IPhotoFactBase {
  FactGUID: string;
  Photo: string;
}

export interface IPhotoFact extends IPhotoFactBase, IBaseInstanceInfo {}

export type IPhotoFactInstance = Sequelize.Instance<IPhotoFact> & IPhotoFact;

export interface IGetPhotosPayload {
  objectGUID: string;
}

export interface IPreparedPhoto {
  url: string;
  createdAt: Date;
  ComponentName: string;
  JobName: string;
  MeasureName: string;
  FactValue: number;
  Comment: string;
}
export interface IGetPhotosResponse {
  photos: IPreparedPhoto[];
}
