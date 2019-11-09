import { ScheduleParamsAttrs } from "../../../constants";

export const routeName = "component";

export const attrFind = {
  default: [
    "GUID",
    "ComponentName",
    "ComponentDescription",
    "ComponentID",
    "Status",
    ...ScheduleParamsAttrs
  ],
  mobile: ["GUID", "ComponentName"]
};

export enum ErrorMessages {}
