import {
  IBaseInstanceInfo,
  ICIMSModelBase,
  IScheduleParams
} from "../../../interfaces";
import Sequelize from "sequelize";
import { ISystemComponentsPercents } from "../../System/interfaces";
import { IComponentPlanFactPercents } from "../../Component/interfaces";
import { IFloorSpacesSystemsComponentsPercents } from "../../Floor/interfaces";

/*
    FACILITY
*/

interface IFacilityAdditionalParams {
  deadline?: Date | null;
  floors?: number | null;
  area?: number | null;
  flats?: number | null;
  mortgage?: string | null;
  website?: string | null;
}

export interface IFacilityBaseFlds {
  FacilityName: string;
  FacilityDescription?: string;
  FacilityID: number;

  coordX?: number | null;
  coordY?: number | null;
  ProjectGUID: string;
  code?: string;
  FacilityClass?: string | null;
  FacilityType?: string | null;
  region: string | null;
  developer: string | null;
  stage: string | null;
  address: string | null;
  mainImg: string | null;
  builder: string | null;
  customer: string | null;
  Status: number | null;
  additionalParams?: IFacilityAdditionalParams | null;
}

export interface IFacilityBase
  extends IFacilityBaseFlds,
    ICIMSModelBase,
    IScheduleParams {}

export interface IFacility extends IFacilityBase, IBaseInstanceInfo {}

export type IFacilityInstance = Sequelize.Instance<IFacility> & IFacility;

export interface IFacilityPhotoItemBase {
  FacilityGUID: string;
  url: string;
}

export interface IFacilityPhotoItem
  extends IFacilityPhotoItemBase,
    IBaseInstanceInfo {}

export type IFacilityPhotoItemInstance = Sequelize.Instance<
  IFacilityPhotoItem
> &
  IFacilityPhotoItem;

// Интерфейсы для контроллеров

export interface IGetFacility {
  GUID?: string;
  ProjectGUID?: string;
}

export interface IFacilitySimple extends IScheduleParams {
  GUID: string;
  FacilityName: string;
  address: string | null;
  additionalParams?: IFacilityAdditionalParams | null;
  FacilityClass?: string | null;
  mainImg: string | null;
  FacilityPercent: number | null;
  Status: number | null;
}

export interface IFacilityFloorsComponentsSystemsPercents extends IFacility {
  Floors: IFloorSpacesSystemsComponentsPercents[];
  Components: IComponentPlanFactPercents[];
  Systems: ISystemComponentsPercents[];
  FacilityPercent: number | null;
}
