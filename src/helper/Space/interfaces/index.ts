import {
  IBaseInstanceInfo,
  ICIMSModelBase,
  ICIMSFloorSpaceParams,
  IScheduleParams
} from "../../../interfaces";
import Sequelize from "sequelize";
import { IComponentPlanFactPercents } from "../../Component/interfaces";
import { ISystemComponentsPercents } from "../../System/interfaces";

/*
    SPACE
*/

export interface ISpaceBaseFlds {
  FloorGUID: string;
  SpaceID: number;
  SpaceFunction: string;
  SpaceNumber: string;

  SpaceName?: string;
  SpaceDescription?: string;
  SpaceUsableHeight?: number;
  SpaceUsableHeightUnits?: string;
  Status: number | null;
}

export interface ISpaceBase
  extends ISpaceBaseFlds,
    ICIMSModelBase,
    IScheduleParams,
    ICIMSFloorSpaceParams {}

export interface ISpace extends ISpaceBase, IBaseInstanceInfo {}

export type ISpaceInstance = Sequelize.Instance<ISpace> & ISpace;

export interface ISpaceSystemsComponentsPercents extends ISpace {
  Components: IComponentPlanFactPercents[];
  Systems: ISystemComponentsPercents[];
  SpacePercent: number | null;
}

export interface ISpaceGetParams {
  FloorGUID: string;
}
