import { ScheduleParamsAttrs } from "../../../constants";
import { CIMSFloorSpaceParamsAttrs } from "../../CIMS/constants";

export const routeName = "space";

export const attrFind = {
  default: [
    "GUID",
    "SpaceFunction",
    "SpaceNumber",
    "SpaceName",
    "SpaceID",
    "SpaceDescription",
    "SpaceUsableHeight",
    "SpaceUsableHeightUnits",
    "Status",
    ...CIMSFloorSpaceParamsAttrs,
    ...ScheduleParamsAttrs
  ],
  mobile: ["GUID", "SpaceName"]
};

export enum ErrorMessages {}
