import Boom from "boom";
import { SystemEvent } from "general/constants";
import logger from "../../utils/logger";

import {
  IBaseSystemEvent,
  IComponentInstallPayload,
  isSystemError
} from "general/interfaces";
import { IDecoratedRequest } from "core/Api/interfaces";
import { ResponseToolkit } from "hapi";
import UserCtrl from "../../helper/User";
import { GeneralErrorMessages } from "../../constants";
import { server } from "../../server";
import SystemError from "general/SystemError";

// TODO: Сократить код, разбить на функции

const EventsConsumer = {
  main: async (req, h) => {
    switch (req.payload.type) {
      case SystemEvent.INSTALL:
        return EventsConsumer.Install(req, h);
      case SystemEvent.UNINSTALL:
        return EventsConsumer.Uninstall(req, h);
      case SystemEvent.ACTIVATE:
        return EventsConsumer.Activate(req, h);
      case SystemEvent.DEACTIVATE:
        return EventsConsumer.Deactivate(req, h);
      default:
        return server.generateHttpError(
          new SystemError({
            code: 400,
            message: GeneralErrorMessages.UNKNOWN_EVENT
          })
        );
    }
  },
  Install: async (
    req: IDecoratedRequest<IComponentInstallPayload>,
    h: ResponseToolkit
  ) => {
    try {
      const { orgId, token } = req.payload;
      const res = await UserCtrl.create({ orgId, token });
      if (isSystemError(res)) {
        throw res;
      }
      return "ok";
    } catch (error) {
      logger.error("Install error -->", error);
      return server.generateHttpError(
        new SystemError({
          code: error.code,
          message: error.message
        })
      );
    }
  },
  Uninstall: async (
    req: IDecoratedRequest<IBaseSystemEvent>,
    h: ResponseToolkit
  ) => {
    try {
      const { orgId } = req.payload;

      const res = await UserCtrl.update({ orgId }, { isDeleted: true });
      if (isSystemError(res)) {
        throw res;
      }
      return "ok";
    } catch (error) {
      logger.error("Uninstall error -->", error);
      return server.generateHttpError(error);
    }
  },
  Activate: async (
    req: IDecoratedRequest<IBaseSystemEvent>,
    h: ResponseToolkit
  ) => {
    try {
      const { orgId } = req.payload;

      const res = await UserCtrl.update({ orgId }, { isActive: true });

      if (isSystemError(res)) {
        throw res;
      }
      return "ok";
    } catch (error) {
      logger.error("Activate error -->", error);
      return server.generateHttpError(error);
    }
  },
  Deactivate: async (
    req: IDecoratedRequest<IBaseSystemEvent>,
    h: ResponseToolkit
  ) => {
    try {
      const { orgId } = req.payload;

      const res = await UserCtrl.update({ orgId }, { isActive: false });

      if (isSystemError(res)) {
        throw res;
      }
      return "ok";
    } catch (error) {
      logger.error("Deactivate error -->", error);
      return server.generateHttpError(error);
    }
  },
  testSystem: async (req, h) => {
    return "ok";
  }
};

export default EventsConsumer;
