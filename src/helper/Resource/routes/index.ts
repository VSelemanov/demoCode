import Boom from "boom";
import validator from "general/Validator";
// constants
import { mainURI } from "../../../constants/index";
import { routeName } from "../constants";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import ResourceCtrl from "../controllers";
// schemas
import readSchema from "../schemas/read/request.schema.json";
import linkJobSchema from "../schemas/linkJob/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
// docs
import { read, create, deleteDoc, updateDoc, linkJob } from "../docs";
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: ResourceCtrl.read,
    options: {
      ...read,
      validate: {
        query: validator.validate(readSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}`,
    handler: ResourceCtrl.create,
    options: {
      ...create,
      validate: {
        payload: validator.validate(createSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}/linkjob`,
    handler: ResourceCtrl.linkJob,
    options: {
      ...linkJob,
      validate: {
        payload: validator.validate(linkJobSchema)
      }
    }
  },
  {
    method: "DELETE",
    path: `${mainURI}/${routeName}`,
    handler: ResourceCtrl.delete,
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
    handler: ResourceCtrl.update,
    options: {
      ...updateDoc,
      validate: {
        payload: validator.validate(updateSchema)
      }
    }
  }
];

export default Routes;
