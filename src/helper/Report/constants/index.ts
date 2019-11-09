export const routeName = "report";

export enum ReportPaths {
  type = "type",
  item = "item",
  file = "file",
  excel = "excel"
}

export const reportFilesPath = "reports";

export const reportCalculatedFlds = [
  "monthPlan",
  "monthFact",
  "yearPlan",
  "yearFact",
  "moneyTotalPlan",
  "moneyIntervalPlan",
  "moneyMonthPlan",
  "moneyIntervalFact",
  "moneyMonthFact"
];

export const attrFind = {
  Report: ["GUID", "dateFrom", "dateTo", "name", "ReportTypeGUID"],
  ReportType: ["GUID", "name", "example"],
  ReportFile: [
    "GUID",
    "filename",
    "extension",
    "version",
    "ReportGUID",
    "size",
    "UserGUID",
    "createdAt"
  ],
  ReportItem: ["GUID", "params", "parentGUID", "ReportFileGUID"]
};

export enum ErrorMessages {}
