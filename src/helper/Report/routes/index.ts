import { mainURI } from "../../../constants/";
import Boom from "boom";
import validator from "general/Validator";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import reportCtrl from "../controllers/";
// schemas
import readSchema from "../schemas/Report/read/request.schema.json";

import factDaysSchema from "../schemas/factDays/request.schema.json";

import readTypeSchema from "../schemas/ReportType/read/request.schema.json";
import createTypeSchema from "../schemas/ReportType/create/request.schema.json";
import deleteTypeSchema from "../schemas/ReportType/delete/request.schema.json";
import updateTypeSchema from "../schemas/ReportType/update/request.schema.json";

import readFileSchema from "../schemas/ReportFile/read/request.schema.json";
import parseXlsSchema from "../schemas/Report/parseXls/request.schema.json";
// docs
import {
  read,
  readType,
  parseXls,
  readFile,
  createType,
  deleteType,
  updateType
} from "../docs";
import { routeName, ReportPaths } from "../constants";
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: reportCtrl.ReportRead,
    options: {
      ...read,
      validate: {
        query: validator.validate(readSchema)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/bi`,
    handler: reportCtrl.BI,
    options: {
      auth: false
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/factDays`,
    handler: reportCtrl.factDays,
    options: {
      validate: {
        query: validator.validate(factDaysSchema)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/${ReportPaths.type}`,
    handler: reportCtrl.ReportTypeRead,
    options: {
      ...readType,
      validate: {
        query: validator.validate(readTypeSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}/${ReportPaths.type}`,
    handler: reportCtrl.ReportTypeCreate,
    options: {
      ...createType,
      validate: {
        payload: validator.validate(createTypeSchema)
      }
    }
  },
  {
    method: "DELETE",
    path: `${mainURI}/${routeName}/${ReportPaths.type}`,
    handler: reportCtrl.ReportTypeDelete,
    options: {
      ...deleteType,
      validate: {
        payload: validator.validate(deleteTypeSchema)
      }
    }
  },
  {
    method: "PUT",
    path: `${mainURI}/${routeName}/${ReportPaths.type}`,
    handler: reportCtrl.ReportTypeUpdate,
    options: {
      ...updateType,
      validate: {
        payload: validator.validate(updateTypeSchema)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/${ReportPaths.excel}`,
    handler: reportCtrl.ReportFileRead,
    options: {
      ...readFile,
      validate: {
        query: validator.validate(readFileSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}/${ReportPaths.excel}`,
    handler: reportCtrl.ExcelParser,
    options: {
      ...parseXls,
      payload: {
        allow: "multipart/form-data",
        parse: true,
        output: "stream"
      },
      validate: {
        payload: validator.validate(parseXlsSchema)
      }
    }
  }
];

export default Routes;
