import * as Sequelize from "sequelize";
import {
  IReportInstance,
  IReport,
  IReportBase,
  IReportFileInstance,
  IReportFileBase,
  IReportFile,
  IReportTypeInstance,
  IReportType,
  IReportTypeBase,
  IReportItemBase,
  IReportItem,
  IReportItemInstance
} from "../interfaces";
import ReportSchema from "./models";
import ReportFileSchema from "./models/ReportFile";
import ReportTypeSchema from "./models/ReportType";
import ReportItemSchema from "./models/ReportItem";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IReportInstance, IReport, IReportBase>(
    "Report",
    ReportSchema,
    {
      indexes: []
    }
  );

  return instance;
};

export const reportFileInstance = (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IReportFileInstance,
    IReportFile,
    IReportFileBase
  >("ReportFile", ReportFileSchema, {
    indexes: []
  });

  return instance;
};

export const reportTypeInstance = (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IReportTypeInstance,
    IReportType,
    IReportTypeBase
  >("ReportType", ReportTypeSchema, {
    indexes: []
  });

  return instance;
};
export const reportItemInstance = (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IReportItemInstance,
    IReportItem,
    IReportItemBase
  >("ReportItem", ReportItemSchema, {
    indexes: []
  });

  return instance;
};
