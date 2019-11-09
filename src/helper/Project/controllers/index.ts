import Boom from "boom";

import { IDecoratedRequest } from "core/Api/interfaces";
import logger from "../../../utils/logger";
import SystemError from "general/SystemError";

import { IProjectBase, IProject, IProjectInstance } from "../interfaces";
import { server } from "../../../server";
import { isSystemError } from "general/interfaces";
import utils from "../../../utils";
import trycatcher from "../../../utils/trycatcher";

import methods from "../";
import { IUserCredentials } from "../../User/interfaces";
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, IUserCredentials>,
      h
    ): Promise<IProject[] | Boom> => {
      const credentials = req.auth.credentials;
      const res = await methods.read(credentials);

      // TODO: fix types
      // @ts-ignore
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),
  readAdmin: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, IUserCredentials>,
      h
    ): Promise<IProject[] | Boom> => {
      const credentials = req.auth.credentials;
      const res = await methods.read(credentials);
      // TODO: fix types
      // @ts-ignore
      return res;
    },
    { logMessage: `${routeName} read admin request`, isRequest: true }
  ),
  create: trycatcher(
    async (
      req: IDecoratedRequest<
        Array<IProjectBase | IProject>,
        {},
        IUserCredentials
      >,
      h
    ): Promise<IProject[] | Boom> => {
      const res = await methods.create(req.payload);
      // TODO: fix types
      // @ts-ignore
      return res;
    },
    { logMessage: `${routeName} create request`, isRequest: true }
  ),
  createFormData: trycatcher(
    async (
      req: IDecoratedRequest<
        Array<IProjectBase | IProject>,
        {},
        IUserCredentials
      >,
      h
    ): Promise<IProject[] | Boom> => {
      // TODO: fix types
      // @ts-ignore
      const res = await methods.createFormData(req.payload);
      return res;
    },
    { logMessage: `${routeName} create formdata request`, isRequest: true }
  ),
  delete: trycatcher(
    async (
      req: IDecoratedRequest<string[], {}, IUserCredentials>,
      h
    ): Promise<string> => {
      const GUIDs = req.payload;
      const res = await methods.delete(GUIDs);
      return "ok";
    },
    {
      logMessage: `${routeName} delete request`,
      isRequest: true
    }
  ),
  update: trycatcher(
    async (
      req: IDecoratedRequest<IProject[], {}, IUserCredentials>,
      h
    ): Promise<IProject[]> => {
      const Projects = req.payload;
      const res = await methods.update(Projects);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  ),
  updateFormData: trycatcher(
    async (
      req: IDecoratedRequest<IProject[], {}, IUserCredentials>,
      h
    ): Promise<IProject[] | Boom> => {
      // TODO: fix types
      // @ts-ignore
      const res = await methods.updateFormData(req.payload);
      return res;
    },
    { logMessage: `${routeName} update formdata request`, isRequest: true }
  ),
  facilityCountReport: trycatcher(
    async (
      req: IDecoratedRequest<
        {},
        { dateFrom: string; dateTo: string; ProjectGUID?: string },
        IUserCredentials
      >,
      h
    ): Promise<IProject[] | Boom> => {
      const { dateFrom, dateTo, ProjectGUID } = req.query;
      const res = await methods.facilityCountReport(
        Date.parse(dateFrom),
        Date.parse(dateTo),
        ProjectGUID || null,
        req.auth.credentials
      );
      return res;
    },
    {
      logMessage: `${routeName} - facility count report request`,
      isRequest: true
    }
  )
};
export default ctrl;
