import { ScheduleParamsAttrs } from "../../../constants";

export const routeName = "facility";

export const attrFind = {
  default: [
    "GUID",
    "FacilityName",
    "FacilityDescription",
    "coordX",
    "coordY",
    "address",
    "additionalParams",
    "developer",
    "region",
    "stage",
    "FacilityClass",
    "FacilityType",
    "mainImg",
    "Status",
    "builder",
    "customer",
    ...ScheduleParamsAttrs
  ],
  simple: [
    "GUID",
    "FacilityName",
    "coordX",
    "coordY",
    "address",
    "additionalParams",
    "FacilityClass",
    "mainImg",
    "Status",
    "builder",
    "customer",
    ...ScheduleParamsAttrs
  ],
  simpleMobile: ["GUID", "FacilityName", "address", "mainImg"],
  defaultMobile: ["GUID", "FacilityName", "FacilityDescription"],
  FacilityPhotoItemDefault: ["GUID", "createdAt", "url", "FacilityGUID"]
};

export enum ErrorMessages {
  FACILITY_NOT_FOUND = "Объект строительства не найден",
  FACILITY_ERROR_REQUEST = "Неизвестный запрос получения объекта строительства"
}
