import Boom from "boom";
import validator from "general/Validator";
// constants
import { mainURI } from "../../../constants/index";
import { routeName } from "../constants";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import JobCtrl from "../controllers";
// schemas
import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import createSingleSchema from "../schemas/createSingle/request.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
// docs
import { read, create, deleteDoc, updateDoc, createSingle } from "../docs";

const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: JobCtrl.read,
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
    handler: JobCtrl.create,
    options: {
      ...create,
      validate: {
        payload: validator.validate(createSchema)
      }
    }
  },
  {
    method: "POST",
    path: `${mainURI}/${routeName}/single`,
    handler: JobCtrl.createSingleJob,
    options: {
      ...createSingle,
      validate: {
        payload: validator.validate(createSingleSchema)
      }
    }
  },
  {
    method: "DELETE",
    path: `${mainURI}/${routeName}`,
    handler: JobCtrl.delete,
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
    handler: JobCtrl.update,
    options: {
      ...updateDoc,
      validate: {
        payload: validator.validate(updateSchema)
      }
    }
  }
];

export default Routes;
