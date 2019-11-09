export const routeName = "resource";

export const attrFind = {
  default: [
    "GUID",
    "ClassificationID",
    "ResourceName",
    "ResourceID",
    "ParentGUID",
    "ClassificationCode"
  ],
  mobile: ["GUID", "ResourceName"]
};

export enum ErrorMessages {
  RESOURCE_NOT_FOUND = "Resource not found"
}

export const ResourceCIMSSheetName = "ЦИМС-Ресурсы";
