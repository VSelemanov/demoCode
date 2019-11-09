import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";
import { IComponent } from "../../Component/interfaces";

/* 
    System
*/

export interface ISystemBaseFlds {
  SystemID: number;
  SystemName: string;
  SystemReferenceID: string;
  SystemDescription?: string;
  SystemFunction?: string | null;

  FacilityGUID?: string | null;
  FloorGUID?: string | null;
  SpaceGUID?: string | null;
  Status: number | null;
}

export interface ISystemBase extends ISystemBaseFlds, ICIMSModelBase {}

export interface ISystem extends ISystemBase, IBaseInstanceInfo {}

export type ISystemInstance = Sequelize.Instance<ISystem> & ISystem;

export interface ISystemComponents extends ISystem {
  Components: IComponent[];
}

export interface ISystemComponentsPercents extends ISystemComponents {
  SystemPercent: number | null;
}

export interface ISystemGetParams {
  FacilityGUID?: string;
  FloorGUID?: string;
  SpaceGUID?: string;
}
