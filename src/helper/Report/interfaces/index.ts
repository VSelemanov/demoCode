import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";
import Stream from "stream";

/* 
    Report
*/

export interface IReportBase {
  dateFrom: Date | null;
  dateTo: Date | null;
  orgId: string | null;
  ReportTypeGUID: string;
  name: string;
}

export interface IReport extends IReportBase, IBaseInstanceInfo {}

export type IReportInstance = Sequelize.Instance<IReport> & IReport;

export interface IReportWithFiles extends IReport {
  ReportFiles: IReportFileWithItems[];
}

export interface IReportGetParams {
  ReportTypeGUID: string;
  dateTo: string;
}

/* *
 *   reportItem
 * */

export interface IReportItemParamsFlds {
  // plan: number;
  // fact: number;
  // totalPlan: number;
  // moneyTotalPlan: number;
  // moneyPlan: number;
  // moneyFact: number;
  name: string;
  monthPlan: number;
  monthFact: number;
  yearPlan: number;
  yearFact: number;
  moneyTotalPlan: number;
  moneyIntervalPlan: number;
  moneyMonthPlan: number;
  moneyIntervalFact: number;
  moneyMonthFact: number;
}

export interface IReportItemBase {
  code?: string;
  params: IReportItemParamsFlds;
  parentGUID: string | null;
  // reportId: string;
  ReportFileGUID: string;
}
export interface IReportItem extends IReportItemBase, IBaseInstanceInfo {}
export interface IReportItemWithChildren extends IReportItem {
  children: IReportItemWithChildren[];
}

export type IReportItemInstance = Sequelize.Instance<IReportItem> & IReportItem;

export interface IReportDumpRow extends IReportItemParamsFlds {
  code?: string;
  name: string;
  ReportGUID: string;
  groupId: string;
  ReportFileGUID: string;
}

export interface IReportMap {
  [key: string]: IReport;
}
export interface IReportItemMap {
  [key: string]: IReportItem;
}

export interface IReportParse {
  ReportFile: Stream.Readable & { hapi: { filename: string } };
  ReportTypeGUID: string;
  ReportGUID?: string;
  sheetName: string;
}

/* *
 *   report file
 * */

export interface IReportFileBase {
  code?: string;
  UserGUID: string;
  filename: string;
  size: number;
  ReportGUID: string;
  version: number;
  extension: string;
}
export interface IReportFile extends IReportFileBase, IBaseInstanceInfo {}

export type IReportFileInstance = Sequelize.Instance<IReportFile> & IReportFile;

export interface IReportFileWithItems extends IReportFile {
  ReportItems: IReportItem[];
}

export interface IReportFileGetParams {
  ReportFileGUID: string;
}

/* *
 *   report type
 * */

export interface IReportTypeBase {
  code?: string;
  name: string;
  example: string;
}
export interface IReportType extends IReportTypeBase, IBaseInstanceInfo {}

export type IReportTypeInstance = Sequelize.Instance<IReportType> & IReportType;
