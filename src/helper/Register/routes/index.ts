import Boom from "boom";
import validator from "general/Validator";
// constants
import { mainURI } from "../../../constants/index";
import { routeName } from "../constants";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import registerCtrl from "../controllers";
// schemas
import readSchema from "../schemas/read/request.schema.json";
// docs
import { read } from "../docs";
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/${routeName}`,
    handler: registerCtrl.read,
    options: {
      ...read,
      validate: {
        query: validator.validate(readSchema)
      }
    }
  }
];

export default Routes;
