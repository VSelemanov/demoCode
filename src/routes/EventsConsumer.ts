import EventsConsumer from "../controllers/system/EventsConsumer";
import Joi from "@hapi/joi";
import { SystemEvent } from "general/constants";
import { mainURI } from "../constants/index";
import Boom from "boom";
import { ServerRoute } from "hapi";

const Events: ServerRoute[] = [
  {
    method: "POST",
    path: `${mainURI}/events`,
    handler: EventsConsumer.main,
    options: {
      validate: {
        payload: {
          orgId: Joi.string()
            .uuid()
            .required(),
          token: Joi.string().uuid(),
          type: Joi.valid(Object.values(SystemEvent)).required()
        }
      },
      auth: {
        strategy: "app-auth"
      }
    }
  }
];

export default Events;
