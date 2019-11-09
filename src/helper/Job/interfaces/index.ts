import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";
import { IMeasure } from "../../Measure/interfaces";

/* 
    Job
*/

export interface IJobBase {
  ENIRGUID: string | null;
  GESNGUID: string | null;
  JobID?: number;
  JobName: string;
  // ResourceGUID?: string | null;
  ParentGUID: string | null;
  MeasureGUID: string | null;
  ClassificationCode: string;
}

export interface IJob extends IJobBase, IBaseInstanceInfo {}

export type IJobInstance = Sequelize.Instance<IJob> & IJob;

export interface IJobGetParams {
  ResourceGUID?: string;
  isTree?: string;
}

export interface IJobWithMeasure extends IJob {
  Measure: IMeasure | null;
}
export interface IJobTree extends IJobWithMeasure {
  children: IJobTree[];
}
