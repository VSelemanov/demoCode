import { IBaseInstanceInfo } from "../../../interfaces";
import Sequelize from "sequelize";

/* 
    Measure
*/

export interface IMeasureBase {
  MeasureName: string;
  MeasureID: number;
}

export interface IMeasure extends IMeasureBase, IBaseInstanceInfo {}

export interface IMeasureForCIMS extends IMeasureBase {
  MeasureIDPick: string;
}

export type IMeasureInstance = Sequelize.Instance<IMeasure> & IMeasure;
