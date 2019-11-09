import Boom from "boom";
import validator from "general/Validator";
// constants
import { mainURI, path } from "../../../constants/index";
import { routeName } from "../constants";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import facilityCtrl from "../controllers";
// schemas
import readSchema from "../schemas/read/request.schema.json";
import readAdminSchema from "../schemas/read/requestAdmin.schema.json";
import factReportSchema from "../schemas/factReport/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import createFormDataSchema from "../schemas/create/formdataRequest.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import updateFormDataSchema from "../schemas/update/formdataRequest.schema.json";
// docs
import {
  read,
  create,
  deleteDoc,
  updateDoc,
  createFormDataDoc,
  updateFormDataDoc,
  factReport,
  readAdmin
} from "../docs";
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: facilityCtrl.read,
    options: {
      ...read,
      validate: {
        query: validator.validate(readSchema)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${path.admin}/${routeName}`,
    handler: facilityCtrl.readAdmin,
    options: {
      ...readAdmin,
      validate: {
        query: validator.validate(readAdminSchema)
      },
      auth: {
        strategy: "admin-auth-jwt"
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/factreport`,
    handler: facilityCtrl.factReport,
    options: {
      ...factReport,
      validate: {
        query: validator.validate(factReportSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}`,
    handler: facilityCtrl.create,
    options: {
      ...create,
      validate: {
        payload: validator.validate(createSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}/${path.formdata}`,
    handler: facilityCtrl.createFormData,
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
    handler: facilityCtrl.delete,
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
    handler: facilityCtrl.update,
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
    handler: facilityCtrl.updateFormData,
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
