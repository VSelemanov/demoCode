import { mainURI, adminPath, path } from "../../../constants/index";
import Boom from "boom";
import validator from "general/Validator";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import projectCtrl from "../controllers";
// schemas
import createSchema from "../schemas/create/request.schema.json";
import createFormDataSchema from "../schemas/create/formdataRequest.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import updateFormDataSchema from "../schemas/update/formdataRequest.schema.json";
import facilityCountReportSchema from "../schemas/facilityCountReport/request.schema.json";
import {
  read,
  readAdmin,
  createDoc,
  deleteDoc,
  updateDoc,
  createFormDataDoc,
  updateFormDataDoc,
  facilityCountReport
} from "../docs/";
import { routeName } from "../constants";

const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: projectCtrl.read,
    options: {
      ...read
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/facilityCountReport`,
    handler: projectCtrl.facilityCountReport,
    options: {
      ...facilityCountReport,
      validate: {
        query: validator.validate(facilityCountReportSchema)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${path.admin}/${routeName}`,
    handler: projectCtrl.readAdmin,
    options: {
      ...readAdmin,
      auth: {
        strategy: "admin-auth-jwt"
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}`,
    handler: projectCtrl.create,
    options: {
      ...createDoc,
      validate: {
        payload: validator.validate(createSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}/${path.formdata}`,
    handler: projectCtrl.createFormData,
    options: {
      ...createFormDataDoc,
      validate: {
        payload: validator.validate(createFormDataSchema)
      },
      payload: {
        allow: "multipart/form-data",
        maxBytes: 1024 * 1024 * 1, // 1 Mb
        parse: true,
        output: "stream"
      }
    }
  },
  {
    method: "DELETE",
    path: `${mainURI}/${routeName}`,
    handler: projectCtrl.delete,
    options: {
      ...deleteDoc,
      validate: {
        payload: validator.validate(deleteSchema)
      }
    }
  },
  {
    method: "PUT",
    path: `${mainURI}/${routeName}`,
    handler: projectCtrl.update,
    options: {
      ...updateDoc,
      validate: {
        payload: validator.validate(updateSchema)
      }
    }
  },
  {
    method: "PUT",
    path: `${mainURI}/${routeName}/${path.formdata}`,
    handler: projectCtrl.updateFormData,
    options: {
      ...updateFormDataDoc,
      validate: {
        payload: validator.validate(updateFormDataSchema)
      },
      payload: {
        allow: "multipart/form-data",
        maxBytes: 1024 * 1024 * 1, // 1 Mb
        parse: true,
        output: "stream"
      }
    }
  }
];

export default Routes;
