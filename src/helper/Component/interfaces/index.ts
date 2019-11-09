import {
  IBaseInstanceInfo,
  ICIMSModelBase,
  IScheduleParams
} from "../../../interfaces";
import Sequelize from "sequelize";
import { IFact } from "../../Fact/interfaces";
import { IPlan } from "../../Plan/interfaces";

/* 
    COMPONENT
*/

export interface IComponentBaseFlds extends IScheduleParams {
  ComponentID: number;
  ComponentName: string;
  // Count: number;
  ComponentDescription?: string;

  RegisterGUID: string;
  FacilityGUID?: string | null;
  FloorGUID?: string | null;
  SpaceGUID?: string | null;
  SystemGUID?: string | null;
  Status: number;
}

export interface IComponentBase extends IComponentBaseFlds, ICIMSModelBase {}

export interface IComponent extends IComponentBase, IBaseInstanceInfo {}

export type IComponentInstance = Sequelize.Instance<IComponent> & IComponent;

export interface IComponentPlanFact extends IComponent {
  Facts: IFact[];
  Plans: IPlan[];
}

export interface IComponentPlanFactPercents extends IComponentPlanFact {
  ComponentPercent: number | null;
  PlanValue: number | null;
  FactValue: number | null;
  ComponentPlanFact: IComponentPlanFactNew[];
}

export interface IComponentPlanFactNew {
  Plan: IPlan;
  Facts: IFact[];
  FactValue: number | null;
  JobAveragePercent: number | null;
}

export interface IComponentGetParams {
  FacilityGUID?: string;
  FloorGUID?: string;
  SpaceGUID?: string;
  SystemGUID?: string;
}
