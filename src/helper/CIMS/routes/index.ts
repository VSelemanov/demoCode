import { ServerRoute } from "hapi";
import { mainURI, path } from "../../../constants";
import ctrl from "../controllers";
import { cims, readTemplate, readResourceSheet } from "../docs";

import cimsRequest from "../schemas/upload/request.schema.json";
import cimsTemplateRequest from "../schemas/template/request.schema.json";

import validator from "general/Validator";
import { routeName } from "../../Resource/constants";

const Routes: ServerRoute[] = [
  {
    method: "POST",
    path: `${mainURI}/${path.cims}/${path.dump}`,
    handler: ctrl.CIMSRequest,
    options: {
      payload: {
        allow: "multipart/form-data",
        maxBytes: 1024 * 1024 * 5, // 5 Mb
        parse: true,
        output: "stream"
      },
      ...cims,
      validate: {
        payload: validator.validate(cimsRequest)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${path.cims}/${path.dump2}`,
    handler: ctrl.CIMSRequest2,
    options: {
      payload: {
        allow: "multipart/form-data",
        maxBytes: 1024 * 1024 * 5, // 5 Mb
        parse: true,
        output: "stream"
      },
      ...cims,
      validate: {
        payload: validator.validate(cimsRequest)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${path.cims}/template`,
    handler: ctrl.ReadTemplate,
    options: {
      ...readTemplate,
      validate: {
        query: validator.validate(cimsTemplateRequest)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${path.cims}/${routeName}`,
    handler: ctrl.ReadResourceSheet,
    options: {
      ...readResourceSheet,
      validate: {
        query: validator.validate(cimsTemplateRequest)
      }
    }
  }
];

export default Routes;
