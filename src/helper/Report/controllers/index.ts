import { IDecoratedRequest } from "core/Api/interfaces";
import SystemError from "general/SystemError";
import Boom from "boom";

import {
  IReportGetParams,
  IReportType,
  IReportFileGetParams,
  IReportParse,
  IReportFileInstance,
  IReportTypeInstance,
  IReportTypeBase,
  IReport,
  IReportWithFiles,
  IReportFileWithItems
} from "../interfaces";
import utils from "../../../utils";
import { reportFilesPath, routeName } from "../constants";

import { ErrorCode } from "general/constants";
import { filesPath, GeneralErrorMessages } from "../../../constants";
import { IUserCredentials } from "../../User/interfaces";
import trycatcher from "../../../utils/trycatcher";
import methods from "..";
import uuid = require("uuid");

import ProjectMethods from "../../Project/index";
import FacilityMethods from "../../Facility/index";
import { IProject } from "../../Project/interfaces";

const reportsPath = `${filesPath}/${reportFilesPath}`;

function getPlanPercent(FacilityName) {
  switch (FacilityName) {
    case "Строительство станции скорой медицинской помощи":
      return 30;

    case "Отделение  поликлиники № 4":
      return 75;

    case 'Одноэтажная пристройка к зданию ГБУЗ "Нижегородский областной кожно-венерологический диспансер"':
      return 90;

    case 'Строительство лечебно-диагностического корпуса ГБУЗ "Консультативно-диагностический центр города Нижнего Новгорода"':
      return 15;

    case "Строительство второго корпуса поликлиники № 5":
      return 25;

    case "Строительство патоморфологического корпуса":
      return 25;

    case "Инфекционное отделение на 30 коек центральной районной больницы":
      return 78;

    case "Школа-детский сад":
      return 17;

    case "Детский сад на 110 мест":
      return 60;

    case "Областной специальный Дом ветеранов и инвалидов с комплексом служб социально-бытового обслуживания":
      return 30;

    case "Жилые дома для работников ГРЭС":
      return 53;

    case "Котельная и сети теплоснабжения":
      return 11;

    case "Объекты и сети водоснабжения и водоотведения":
      return 88;

    case "Пожарный отряд":
      return 93;

    case "Строительство пожарной части по охране г.Нижнего Новгорода":
      return 25;

    case "Строительство легкоатлетического манежа в г.Нижнем Новгороде":
      return 32;

    case "Спортивная школа олимпийского резерва по конькобежному спорту":
      return 90;

    case "Реконструкция СДЮСШОР по восточным видам единоборств":
      return 10;

    case "Центр бокса в г.Нижнем Новгороде":
      return 80;

    case "Строительство Дома культуры":
      return 7;

    case "Строительство центра культурного развития":
      return 83;

    case "Строительство детского дома искусств":
      return 50;

    case "Строительство многофункционального культурного центра":
      return 31;

    case "Здание ЗАГСа":
      return 13;

    case "Дом ветеранов":
      return 42;

    default:
      return 0;
  }
}

const reportCtrl = {
  BI: trycatcher(
    async (req: IDecoratedRequest<{}, {}, IUserCredentials>, h) => {
      return await methods.BI(req.auth.credentials);
    },
    { logMessage: "BI request", isRequest: true }
  ),
  factDays: trycatcher(
    async (req: IDecoratedRequest<{}, {date: string}, IUserCredentials>, h) => {
      return await methods.factDays(req.query.date, req.auth.credentials);
    },
    { logMessage: "factDays request", isRequest: true }
  ),
  ReportRead: trycatcher(
    async (
      req: IDecoratedRequest<{}, IReportGetParams, IUserCredentials>,
      h
    ) => {
      const { orgId } = req.auth.credentials;
      const { ReportTypeGUID, dateTo } = req.query;

      const fileDate = dateTo ? new Date(Date.parse(dateTo)) : new Date();

      const reports = await methods.ReportRead(ReportTypeGUID, fileDate);

      if (
        (ReportTypeGUID as string) === "d21a51c4-b69a-4adf-b77f-6dce499bc3c7"
      ) {
        const Projects = await ProjectMethods.read(req.auth.credentials);
        for (const Project of Projects) {
          let averagePercent = 0;
          const Facilities = await FacilityMethods.readList(
            Project.GUID,
            false,
            req.auth.credentials
          );
          for (const Facility of Facilities) {
            Facility.planPercent = getPlanPercent(Facility.FacilityName);
            averagePercent += Facility.planPercent;
          }
          Project.planPercent = averagePercent / (Facilities.length || 1);
          Project.Facilities = Facilities;
        }
        return Projects;
      }

      return reports;
    },
    {
      logMessage: `${routeName} read request`,
      isRequest: true
    }
  ),
  ReportTypeRead: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, IUserCredentials>
    ): Promise<IReportType[]> => {
      const ReportType = (await methods.ReportTypeRead()) as IReportType[];

      return ReportType;
    },
    { logMessage: `${routeName} type read request`, isRequest: true }
  ),
  ReportTypeCreate: trycatcher(
    async (
      req: IDecoratedRequest<IReportTypeBase[], {}, IUserCredentials>
    ): Promise<IReportType[]> => {
      const res: IReportTypeInstance[] = await methods.ReportTypeCreate(
        req.payload
      );
      return res;
    },
    { logMessage: `${routeName} type create request`, isRequest: true }
  ),
  ReportTypeDelete: trycatcher(
    async (
      req: IDecoratedRequest<string[], {}, IUserCredentials>,
      h
    ): Promise<string> => {
      const GUIDs = req.payload;
      const res = await methods.ReportTypeDelete(GUIDs);
      return "ok";
    },
    {
      logMessage: `${routeName} type delete request`,
      isRequest: true
    }
  ),
  ReportTypeUpdate: trycatcher(
    async (
      req: IDecoratedRequest<IReportType[], {}, IUserCredentials>,
      h
    ): Promise<IReportType[]> => {
      const Projects = req.payload;
      const res = await methods.ReportTypeUpdate(Projects);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  ),

  ReportFileRead: trycatcher(
    async (
      req: IDecoratedRequest<{}, IReportFileGetParams, IUserCredentials>,
      h
    ): Promise<any | Boom> => {
      // const { orgId } = req.auth.credentials;
      const { ReportFileGUID } = req.query;

      const res: IReportFileInstance = await methods.ReportFileRead(
        ReportFileGUID
      );
      if (!res) {
        throw new SystemError({
          code: ErrorCode.NOT_FOUND,
          message: GeneralErrorMessages.FILE_NOT_FOUND
        });
      }

      const fileData = utils.mapElementsToJSON([res])[0];

      return h.file(
        `${reportsPath}/${fileData.GUID}${
          fileData.extension ? `.${fileData.extension}` : ""
        }`,
        {
          filename: fileData.filename,
          mode: "attachment"
        }
      );
    },
    { logMessage: `${routeName} file read request` }
  ),
  ExcelParser: trycatcher(
    async (
      req: IDecoratedRequest<IReportParse, {}, IUserCredentials>,
      h
    ): Promise<any | Boom> => {
      const {
        ReportFile,
        ReportTypeGUID,
        ReportGUID /*, sheetName */
      } = req.payload;
      const { orgId, GUID } = req.auth.credentials;

      return await methods.ExcelParser(
        ReportFile,
        ReportTypeGUID,
        ReportGUID,
        orgId,
        GUID
      );
    },
    { logMessage: `${routeName} excel parse request`, isRequest: true }
  )
};
export default reportCtrl;
