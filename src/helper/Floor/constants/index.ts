import { ScheduleParamsAttrs } from "../../../constants";
import { CIMSFloorSpaceParamsAttrs } from "../../CIMS/constants";

export const routeName = "floor";

export const attrFind = {
  default: [
    "GUID",
    "FloorName",
    "FloorID",
    "FloorDescription",
    "FloorElevation",
    "FloorElevationUnits",
    "FloorTotalHeight",
    "FloorTotalHeightUnits",
    "Status",
    ...CIMSFloorSpaceParamsAttrs,
    ...ScheduleParamsAttrs
  ],
  mobile: ["GUID", "FloorName"]
};

export enum ErrorMessages {}
