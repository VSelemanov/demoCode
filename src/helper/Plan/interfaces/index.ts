import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";

/* 
    Plan
*/

export interface IPlanBase {
  ComponentGUID: string;
  isResource: boolean;
  value: number;
  JobGUID: string;
}

export interface IPlan extends IPlanBase, IBaseInstanceInfo {}

export type IPlanInstance = Sequelize.Instance<IPlan> & IPlan;

export interface IPlanGetParams {
  ComponentGUID: string;
}

export interface IPlanGetResponse {
  JobPlan: IPlan;
  ResourcePlan: IPlan;
}
