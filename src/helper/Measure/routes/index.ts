import Boom from "boom";
import validator from "general/Validator";
// constants
import { mainURI } from "../../../constants/index";
import { routeName } from "../constants";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import MeasureCtrl from "../controllers";
// schemas
import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import deleteSchema from "../schemas/delete/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
// docs
import { read, create, deleteDoc, updateDoc } from "../docs";
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: MeasureCtrl.read,
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
    handler: MeasureCtrl.create,
    options: {
      ...create,
      validate: {
        payload: validator.validate(createSchema)
      }
    }
  },
  {
    method: "DELETE",
    path: `${mainURI}/${routeName}`,
    handler: MeasureCtrl.delete,
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
    handler: MeasureCtrl.update,
    options: {
      ...updateDoc,
      validate: {
        payload: validator.validate(updateSchema)
      }
    }
  }
];

export default Routes;
