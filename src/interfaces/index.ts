import Sequelize from "sequelize";
import Stream from "stream";
import { string } from "@hapi/joi";

export interface IBaseInstanceInfo {
  GUID: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleParams {
  startedAt: Date;
  finishedAt: Date;
}

export interface ICIMSModelBase {
  ExternalSystemName: string;
  ExternalNameID: string;
  CreatedBy: string;
  Withdrawn: string;
}

export interface ICIMSFloorSpaceParams {
  ExteriorGrossArea?: number;
  ExteriorGrossAreaUnit?: string;
  InteriorGrossArea?: number;
  InteriorGrossAreaUnit?: string;
  PlannableGrossArea?: number;
  PlannableGrossAreaUnit?: string;
  RentableAreaUsableArea?: number;
  RentableAreaUsableAreaUnits?: string;
  InteriorPlannableArea?: number;
  InteriorPlannableAreaUnits?: number;
  CalculationMethod?: string;
}

export interface IBaseFactInstanceInfo {
  GUID: string;
  createdAt: Date;
}

export interface IGetEntityByTree {
  isTree?: string;
}

export interface ICDNAuthHeaders {
  ["X-Auth-User"]: string;
  ["X-Auth-Key"]: string;
}
