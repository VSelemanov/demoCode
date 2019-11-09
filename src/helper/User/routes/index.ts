// import Boom from "boom";
// import validator from "general/Validator";
// // constants
// import { mainURI } from "../../../constants/index";
// import { routeName } from "../constants";
// // interfaces
// import { ServerRoute } from "hapi";
// // controllers
// // import UserCtrl from "../controllers";
// // schemas
// import readSchema from "../schemas/read/request.schema.json";
// import createSchema from "../schemas/read/request.schema.json";
// // docs
// import { read, create } from "../docs";
// const Routes: ServerRoute[] = [
//   {
//     method: "GET",
//     path: `${mainURI}/${routeName}`,
//     handler: UserCtrl.read,
//     options: {
//       ...read,
//       validate: {
//         query: validator.validate(readSchema)
//       }
//     }
//   },
//   {
//     method: "POST",
//     path: `${mainURI}/${routeName}`,
//     handler: UserCtrl.create,
//     options: {
//       ...create,
//       validate: {
//         payload: validator.validate(createSchema)
//       }
//     }
//   }
// ];

// export default Routes;
