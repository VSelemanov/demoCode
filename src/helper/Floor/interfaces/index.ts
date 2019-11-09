import {
  IBaseInstanceInfo,
  ICIMSModelBase,
  ICIMSFloorSpaceParams,
  IScheduleParams
} from "../../../interfaces";
import Sequelize from "sequelize";
import { IComponentPlanFactPercents } from "../../Component/interfaces";
import { ISystemComponentsPercents } from "../../System/interfaces";
import { ISpaceSystemsComponentsPercents } from "../../Space/interfaces";

/*
    FLOOR
*/

export interface IFloorBaseFlds {
  FacilityGUID: string;
  FloorID: number;
  FloorName: string;
  FloorReferenceID: string;

  FloorElevation?: number;
  FloorElevationUnits?: string;
  FloorTotalHeight?: number;
  FloorTotalHeightUnits?: string;
  Status: number | null;
}

export interface IFloorBase
  extends IFloorBaseFlds,
    ICIMSModelBase,
    IScheduleParams,
    ICIMSFloorSpaceParams {}

export interface IFloor extends IFloorBase, IBaseInstanceInfo {}

export type IFloorInstance = Sequelize.Instance<IFloor> & IFloor;

export interface IFloorSpacesSystemsComponentsPercents extends IFloor {
  Spaces: ISpaceSystemsComponentsPercents[];
  Components: IComponentPlanFactPercents[];
  Systems: ISystemComponentsPercents[];
  FloorPercent: number | null;
}

export interface IFloorGetParams {
  FacilityGUID: string;
}
