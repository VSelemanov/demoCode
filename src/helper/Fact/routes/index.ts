import Boom from "boom";
import validator from "general/Validator";
// constants
import { mainURI } from "../../../constants/index";
import { routeName } from "../constants";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import FactCtrl from "../controllers";
// schemas
import readSchema from "../schemas/read/request.schema.json";
import createSchema from "../schemas/create/request.schema.json";
import updateSchema from "../schemas/update/request.schema.json";
import photosSchema from "../schemas/photos/request.schema.json";
// docs
import { read, create, updateDoc, getPhotosDoc } from "../docs";
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: FactCtrl.read,
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
    handler: FactCtrl.create,
    options: {
      ...create,
      payload: {
        allow: "multipart/form-data",
        maxBytes: 1024 * 1024 * 15, // 5 Mb
        parse: true,
        output: "stream"
      },
      validate: {
        payload: validator.validate(createSchema)
      }
    }
  },
  {
    method: "PUT",
    path: `${mainURI}/${routeName}`,
    handler: FactCtrl.update,
    options: {
      ...updateDoc,
      validate: {
        payload: validator.validate(updateSchema)
      }
    }
  },
  {
    method: "GET",
    path: `${mainURI}/${routeName}/photos`,
    handler: FactCtrl.getPhotos,
    options: {
      ...getPhotosDoc,
      validate: {
        query: validator.validate(photosSchema)
      }
    }
  }
];

export default Routes;
