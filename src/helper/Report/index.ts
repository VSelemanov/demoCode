import { server } from "../../server";
import utils from "../../utils";
import {
  IReportBase,
  IReportInstance,
  IReport,
  IReportItem,
  IReportFileWithItems,
  IReportWithFiles,
  IReportType,
  IReportTypeBase,
  IReportDumpRow,
  IReportItemMap,
  IReportFile,
  IReportItemBase,
  IReportFileBase,
  IReportFileInstance
} from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import {
  routeName,
  attrFind,
  reportCalculatedFlds,
  reportFilesPath
} from "./constants";
import { Op } from "sequelize";
import SystemError from "general/SystemError";
import uuid = require("uuid");
import xlsx from "xlsx";
import { isSystemError } from "general/interfaces";
import { filesPath } from "../../constants";
import sequelize = require("sequelize");
import fs from "fs";
import { IProjectInstance } from "../Project/interfaces";
import { IFacilityInstance } from "../Facility/interfaces";
import { IComponentInstance } from "../Component/interfaces";
import { IFactInstance } from "../Fact/interfaces";
import { Parser } from "json2csv";
import { IFloorInstance } from "../Floor/interfaces";

interface IBIData {
  index: number;
  project: string;
  facility: string;
  developer: string;
  component: string;
  floor: string;
  date: Date;
  value: number;
}

interface IProjectsForIB extends IProjectInstance {
  Facilities: Array<
    IFacilityInstance & {
      Components: Array<IComponentInstance & { Facts: IFactInstance[] }>;
    }
  >;
}

interface IComponentWithFacts extends IComponentInstance {
  Facts: IFactInstance[];
}
interface IFacilityWithFloorsAndFacts extends IFacilityInstance {
  Components: IComponentWithFacts[];
  Floors: Array<IFloorInstance & { Components: IComponentWithFacts[] }>;
}

interface IProjectWithFacts extends IProjectInstance {
  Facilities: IFacilityWithFloorsAndFacts[];
}

const methods = {
  factDays: trycatcher(
    async (reportDate, credentials): Promise<any> => {
      
      const date = new Date(reportDate);

      const thisFrom = getPreviousMonday(date);
      const thisTo = new Date(thisFrom.getTime() + 7 * 24 * 3600 * 1000 - 1);

      const prevTo = new Date(thisFrom.getTime() - 1);
      const prevFrom = getPreviousMonday(prevTo);

      const prePrevTo = new Date(prevFrom.getTime() - 1);
      const prePrevFrom = getPreviousMonday(prePrevTo);

      date.setTime(date.getTime() + 24 * 3600 * 1000 - 1); 

      const projects = (await server.Project.findAll({
        // @ts-ignore
        accContext: credentials,
        logging: console.log,
        include: [
          {
            model: server.Facility,
            include: [
              {
                model: server.Component,
                include: [
                  {
                    model: server.Fact,
                    where: {
                      createdAt: {
                        $lte: thisTo
                      }
                    }
                  }
                ]
              },
              {
                model: server.Floor,
                include: [
                  {
                    model: server.Component,
                    include: [
                      {
                        model: server.Fact,
                        where: {
                          createdAt: {
                            $lte: thisTo
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })) as IProjectWithFacts[];

      function calcFactDaysForFacility(
        facility: IFacilityWithFloorsAndFacts,
        date: Date
      ): any {
        let facts: IFactInstance[] = [];

        facility.Components.forEach(component => {
          facts = facts.concat(component.Facts);
        });

        facility.Floors.forEach(floor => {
          floor.Components.forEach(component => {
            facts = facts.concat(component.Facts);
          });
        });

        const factNums: number[][] = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
        ];
        console.log({
          thisFrom,
          thisTo,
          prevFrom,
          prevTo,
          prePrevFrom,
          prePrevTo
        });

        for (const fact of facts) {
          const day = fact.createdAt.getDay();

          if (fact.createdAt.getTime() >= thisFrom.getTime() && fact.createdAt.getTime() <= thisTo.getTime()) {
            factNums[0][day] += 1;
          }
          if (fact.createdAt.getTime() >= prevFrom.getTime() && fact.createdAt.getTime() <= prevTo.getTime()) {
            factNums[1][day] += 1;
          }
          if (fact.createdAt.getTime() >= prePrevFrom.getTime() && fact.createdAt.getTime() <= prePrevTo.getTime()) {
            factNums[2][day] += 1;
          }
        }

        const factsInWeek = factNums.map(week => {
          return week.filter(el => el).length;
        });

        return {
          ...facility.toJSON(),
          factNums,
          factsInWeek,
          totalFacts: facts.length
        };
      }

      function getPreviousMonday(date: Date = new Date()) {
        const prevMonday = new Date(date.getTime()) || new Date();
        prevMonday.setDate(
          prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7)
        );
        prevMonday.setHours(0);
        prevMonday.setMinutes(0);
        prevMonday.setSeconds(0);
        prevMonday.setMilliseconds(0);
        return prevMonday;
      }

      const ret = projects.map(project => {
        return {
          ...project.toJSON(),
          Facilities: project.Facilities.map(facility =>
            calcFactDaysForFacility(facility, new Date(date))
          )
        };
      });

      return ret;
    }
  ),
  BI: trycatcher(
    // async (): Promise<{ BIData: IBIData[]; csv: string }> => {
    async (credentials): Promise<string> => {
      const Projects = (await server.Project.findAll({
        include: [
          {
            model: server.Facility,
            include: [
              {
                model: server.Component,
                include: [
                  {
                    model: server.Fact
                  }
                ]
              },
              {
                model: server.Floor,
                include: [
                  {
                    model: server.Component,
                    include: [
                      {
                        model: server.Fact
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        // @ts-ignore
        secDisable: true
      })) as IProjectWithFacts[];

      console.log({ Projects });

      const BIData: IBIData[] = [];
      let counter = 0;
      for (const Project of Projects) {
        for (const Facility of Project.Facilities) {
          for (const Floor of Facility.Floors) {
            for (const Component of Floor.Components) {
              for (const Fact of Component.Facts) {
                BIData.push({
                  index: ++counter,
                  project: Project.name,
                  facility: Facility.FacilityName,
                  floor: Floor.FloorName,
                  developer: Facility.developer || " ",
                  component: Component.ComponentName,
                  date: Fact.createdAt,
                  value: Fact.value
                });
              }
            }
          }

          for (const Component of Facility.Components) {
            for (const Fact of Component.Facts) {
              BIData.push({
                index: ++counter,
                project: Project.name,
                facility: Facility.FacilityName,
                developer: Facility.developer || " ",
                floor: "",
                component: Component.ComponentName,
                date: Fact.createdAt,
                value: Fact.value
              });
            }
          }
        }
      }
      console.log({ BIData });

      const data = new Parser({
        fields: [
          "index",
          "project",
          "facility",
          "developer",
          "component",
          "date",
          "value"
        ],
        delimiter: ";"
      }).parse(BIData);

      return data;

      // return {
      //   BIData,
      //   csv: data
      // };
    },
    { logMessage: "BI method" }
  ),
  ReportCreate: trycatcher(
    async (rows: IReportBase[]): Promise<IReport[] | SystemError> => {
      const res = await utils.createRows<IReportBase, IReport>(
        rows,
        server.Report,
        { upsert: true }
      );
      const reports = utils.mapElementsToJSON(res);
      return reports;
    },
    { logMessage: `${routeName} create method` }
  ),
  ReportRead: trycatcher(
    async (
      ReportTypeGUID: string,
      fileDate: Date
    ): Promise<IReportWithFiles[]> => {
      const res = await server.Report.findAll({
        where: {
          // orgId,
          ReportTypeGUID
        },
        attributes: attrFind.Report,
        include: [
          {
            model: server.ReportFile,
            attributes: attrFind.ReportFile,
            where: {
              createdAt: {
                [Op.lte]: fileDate
              }
            },
            include: [
              {
                model: server.ReportItem,
                attributes: attrFind.ReportItem
              }
            ]
          }
        ],
        order: [
          [server.ReportFile, "version"],
          [server.ReportFile, { model: server.ReportItem }, "code"]
        ]
      });

      const reports = utils.mapElementsToJSON(res) as IReportWithFiles[];

      for (const report of reports) {
        for (const file of report.ReportFiles as IReportFileWithItems[]) {
          file.ReportItems = utils.tree<IReportItem>(
            file.ReportItems.filter(r => r.parentGUID === null),
            file.ReportItems,
            "GUID",
            "parentGUID"
          );
        }
      }
      return reports;
    },
    {
      logMessage: `${routeName} read method`
    }
  ),

  ReportTypeCreate: trycatcher(
    async (rows: IReportTypeBase[]): Promise<IReportType[] | SystemError> => {
      const res = await utils.createRows<IReportTypeBase, IReportType>(
        rows,
        server.ReportType
      );
      const ReportTypes = utils.mapElementsToJSON(res);
      return ReportTypes;
    },
    { logMessage: `${routeName} type create method` }
  ),
  ReportTypeRead: trycatcher(
    async (): Promise<IReportType[]> => {
      const res = await server.ReportType.findAll({
        attributes: attrFind.ReportType
      });
      const reportTypes = utils.mapElementsToJSON(res);
      return reportTypes;
    },
    {
      logMessage: `${routeName} type read method`
    }
  ),
  ReportTypeDelete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.ReportType);
    },
    {
      logMessage: `${routeName} type delete request`,
      isRequest: true
    }
  ),
  ReportTypeUpdate: trycatcher(
    async (ReportTypes: IReportType[]): Promise<IReportType[]> => {
      const UPDReportTypes = await utils.updateRows<IReportType>(
        ReportTypes,
        server.ReportType
      );
      return utils.mapElementsToJSON(UPDReportTypes);
    },
    {
      logMessage: `${routeName} type update method`,
      isRequest: true
    }
  ),
  ReportItemsCreate: trycatcher(
    async (rows: IReportItemBase[]): Promise<IReportItem[] | SystemError> => {
      const res = await utils.createRows<IReportItemBase, IReportItem>(
        rows,
        server.ReportItem,
        { upsert: true }
      );
      const rItems = utils.mapElementsToJSON(res);
      return rItems;
    },
    { logMessage: `${routeName} item create method` }
  ),
  ReportFileCreate: trycatcher(
    async (rows: IReportFileBase[]): Promise<IReportFile[] | SystemError> => {
      const res = await utils.createRows<IReportFileBase, IReportFile>(
        rows,
        server.ReportFile,
        { upsert: true }
      );
      const reportFiles = utils.mapElementsToJSON(res);
      return reportFiles;
    },
    { logMessage: `${routeName} file create method` }
  ),
  ReportFileRead: trycatcher(
    async (ReportFileGUID: string): Promise<IReportFileInstance | null> => {
      return await server.ReportFile.findByPk(ReportFileGUID);
    },
    {
      logMessage: `${routeName} file read method`
    }
  ),
  ExcelParser: trycatcher(
    async (
      ReportFile,
      ReportTypeGUID: string,
      ReportGUID: string,
      orgId: string,
      GUID: string
    ): Promise<any> => {
      const report: IReport = {
        GUID: ReportGUID || uuid.v4(),
        name: "",
        dateFrom: null,
        dateTo: null,
        ReportTypeGUID,
        orgId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!ReportGUID) {
        const reportRes = await methods.ReportCreate([report]);
      }

      const ver = await server.ReportFile.findOne({
        where: {
          ReportGUID
        },
        attributes: [[sequelize.fn("MAX", sequelize.col("version")), "version"]]
      });

      let version = 1;
      if (ver && ver.version) {
        version = ver.version + 1;
      }

      const ext = utils.getExtension(ReportFile.hapi.filename);
      const filename = ext.index
        ? ReportFile.hapi.filename.slice(0, ext.index - 1)
        : ReportFile.hapi.filename;

      const fileRow: IReportFile = {
        GUID: uuid.v4(),
        filename,
        size: 0,
        ReportGUID: report.GUID,
        UserGUID: GUID,
        version,
        extension: ext[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      utils.createFolder(`${filesPath}`);
      utils.createFolder(`${filesPath}/${reportFilesPath}`);

      const fileStream = fs.createWriteStream(
        `${filesPath}/${reportFilesPath}/${fileRow.GUID}${
          ext[0] ? `.${ext[0]}` : ""
        }`,
        {
          flags: "w"
        }
      );

      let file: Buffer = new Buffer("");
      const result = await new Promise((resolve, reject) => {
        ReportFile.on("data", data => {
          file = Buffer.concat([file, data]);
          fileStream.write(data);
        });

        ReportFile.on("end", async () => {
          const resFile = await methods.ReportFileCreate([
            { ...fileRow, size: file.byteLength }
          ]);

          if (isSystemError(resFile)) {
            reject(resFile);
          }
          const xls = xlsx.read(file, { type: "buffer" });
          const reportItems = methods.parseMinstroiExcel(
            xls,
            report.GUID,
            fileRow.GUID
            // sheetName
          );

          if (isSystemError(reportItems)) {
            reject(reportItems);
          }
          const reportItemsParsed = methods.parseDumpData(
            reportItems as IReportDumpRow[]
          );

          const res = await methods.ReportItemsCreate(reportItemsParsed);
          if (isSystemError(res)) {
            reject(res);
          }
          resolve("Ok");
        });
      });
      return result;
    },
    { logMessage: "excel parser method", isRequest: true }
  ),

  parseMinstroiExcel: (
    xls: xlsx.WorkBook,
    ReportGUID: string,
    ReportFileGUID: string
    // sheetName: string
  ): IReportDumpRow[] | SystemError => {
    /*if (!xls.SheetNames.includes(sheetName)) {
      return new SystemError({
        code: 404,
        message: errorMessages.SHEET_NOT_FOUND
      });
    }*/

    const sheet: any[] = xlsx.utils.sheet_to_json(
      xls.Sheets[Object.keys(xls.Sheets)[0]],
      {
        raw: true,
        header: "A",
        defval: null
      }
    );

    const reportItems: IReportDumpRow[] = [];

    for (let i = 2; i <= sheet.length - 2; i++) {
      const row = sheet[i];
      if (!row.A && !row.B) {
        continue;
      }
      reportItems.push({
        code: `${row.A}`,
        groupId: row.B,
        name: utils.totalTrim(`${row.C}`),
        moneyIntervalFact: row.O || 0,
        moneyIntervalPlan: row.M || 0,
        moneyMonthFact: row.P === "-" ? 0 : row.P || 0,
        moneyMonthPlan: row.N || 0,
        moneyTotalPlan: row.L || 0,
        monthFact: row.I || 0,
        monthPlan: row.H || 0,
        yearFact: row.E || 0,
        yearPlan: row.D || 0,

        ReportGUID,
        ReportFileGUID
      });
    }

    return reportItems;
  },
  parseDumpData: (rows: IReportDumpRow[]): IReportItem[] => {
    const items: IReportItem[] = [];
    const groups: IReportItemMap = {};
    const parentGroups: IReportItemMap = {};

    const emptyReportItem: IReportItem = {
      GUID: "",
      params: {
        moneyIntervalFact: 0,
        moneyIntervalPlan: 0,
        moneyMonthFact: 0,
        moneyMonthPlan: 0,
        moneyTotalPlan: 0,
        monthFact: 0,
        monthPlan: 0,
        yearFact: 0,
        yearPlan: 0,
        name: ""
      },
      ReportFileGUID: "",
      parentGUID: null,
      // reportId: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    for (const row of rows) {
      if (!parentGroups[row.ReportGUID]) {
        parentGroups[row.ReportGUID] = {
          ...emptyReportItem,
          GUID: uuid.v4(),
          params: {
            ...emptyReportItem.params,
            name: "Всего"
          },
          // reportId: row.reportId,
          ReportFileGUID: row.ReportFileGUID
        };
      }

      if (!groups[row.groupId]) {
        groups[row.groupId] = {
          ...emptyReportItem,
          GUID: uuid.v4(),
          params: {
            ...emptyReportItem.params,
            name: row.groupId
          },
          parentGUID: parentGroups[row.ReportGUID].GUID,
          // reportId: row.reportId,
          ReportFileGUID: row.ReportFileGUID
        };
      }

      // Суммируем все необходимые элементы для группы
      methods.sumElements(groups[row.groupId], row);

      // Суммируем все необходимые элементы для группы
      methods.sumElements(parentGroups[row.ReportGUID], row);

      items.push({
        ...emptyReportItem,
        GUID: uuid.v4(),
        code: row.code,
        params: {
          name: row.name,
          moneyIntervalFact: row.moneyIntervalFact,
          moneyIntervalPlan: row.moneyIntervalPlan,
          moneyMonthFact: row.moneyMonthFact,
          moneyMonthPlan: row.moneyMonthPlan,
          moneyTotalPlan: row.moneyTotalPlan,
          monthFact: row.monthFact,
          monthPlan: row.monthPlan,
          yearFact: row.yearFact,
          yearPlan: row.yearPlan
        },
        ReportFileGUID: row.ReportFileGUID,
        parentGUID: groups[row.groupId].GUID
      });
    }

    const groupsArray: IReportItem[] = utils.mapToArray(groups);

    const parentGroupsArray: IReportItem[] = utils.mapToArray(parentGroups);

    return [...parentGroupsArray, ...groupsArray, ...items];
  },
  sumElements: (targetRow: IReportItem, dataRow: IReportDumpRow) => {
    for (const fldName of reportCalculatedFlds) {
      targetRow.params[fldName] = utils.sumFloat(
        +dataRow[fldName],
        +targetRow.params[fldName]
      );
    }
  }
};

export default methods;
