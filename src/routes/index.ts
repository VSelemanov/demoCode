import {
  moduleName,
  VERSION,
  mainURI,
  path,
  CDNContainerName
} from "../constants/index";
import validator from "general/Validator";
import Boom from "boom";
// interfaces
import { ServerRoute } from "hapi";
// controllers
import EventsCtrl from "../controllers/system/EventsConsumer";

import Events from "./EventsConsumer";
// new routes
import PlanFactRoutes from "../helper/PlanFact/routes";
import ProjectRoutes from "../helper/Project/routes";
import ComponentRoutes from "../helper/Component/routes";
import RegisterRoutes from "../helper/Register/routes";
import FacilityRoutes from "../helper/Facility/routes";
import FloorRoutes from "../helper/Floor/routes";
import SpaceRoutes from "../helper/Space/routes/";
import SystemRoutes from "../helper/System/routes/";
import ReportRoutes from "../helper/Report/routes";
import MeasureRoutes from "../helper/Measure/routes";

import FactRoutes from "../helper/Fact/routes/";
import PlanRoutes from "../helper/Plan/routes/";

import ResourceRoutes from "../helper/Resource/routes/";
import JobRoutes from "../helper/Job/routes/";

import CIMSRoutes from "../helper/CIMS/routes";
import { server } from "../server";
import utils from "../utils";
import { IDecoratedRequest } from "core/Api/interfaces";
import { Stream } from "stream";
import { getSummary } from "@promster/hapi";

const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/testSystem`,
    handler: EventsCtrl.testSystem,
    options: {
      auth: false
    }
  },
  {
    method: "GET",
    path: `${mainURI}/metrics`,
    options: {
      auth: false
    },
    handler: () => {
      return getSummary();
    }
  },
  ...Events,
  ...PlanFactRoutes,
  ...ProjectRoutes,
  ...ReportRoutes,
  // new
  ...MeasureRoutes,
  ...CIMSRoutes,
  ...ComponentRoutes,
  ...FacilityRoutes,
  ...FloorRoutes,
  ...RegisterRoutes,
  ...SpaceRoutes,
  ...SystemRoutes,
  ...FactRoutes,
  ...PlanRoutes,
  ...ResourceRoutes,
  ...JobRoutes
];

export default Routes;
