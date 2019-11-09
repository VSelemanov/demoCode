export enum CIMSSheets {
  Contact = "01-Контакт",
  Facility = "02-Объект",
  Floor = "03-Этажи",
  Space = "04-Помещения",
  System = "05-Система",
  Register = "06-Регистрация",
  Component = "07-Компонент"
}

export const CIMSFloorSpaceParamsAttrs = [
  "ExteriorGrossArea",
  "ExteriorGrossAreaUnit",
  "InteriorGrossArea",
  "InteriorGrossAreaUnit",
  "PlannableGrossArea",
  "PlannableGrossAreaUnit",
  "RentableAreaUsableArea",
  "InteriorPlannableArea",
  "InteriorPlannableAreaUnits",
  "CalculationMethod"
];

export const CIMSTemplateFilename = "cimstemplate.xlsx";

export const ResourceSheetFilename = "cimsresources.xlsx";
