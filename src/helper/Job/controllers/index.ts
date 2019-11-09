import trycatcher from "../../../utils/trycatcher";
import {
  IJobBase,
  IJobInstance,
  IJob,
  IJobGetParams,
  IJobWithMeasure,
  IJobTree
} from "../interfaces";
import uuid = require("uuid");
import { IDecoratedRequest } from "core/Api/interfaces";
import methods from "../index";
import utils from "../../../utils";
import { IUserCredentials } from "../../User/interfaces";
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IJobGetParams, IUserCredentials>,
      h
    ): Promise<IJobWithMeasure[] | IJobTree[]> => {
      const { ResourceGUID, isTree } = req.query;
      const res = await methods.read(
        ResourceGUID ? ResourceGUID : null,
        isTree === "true"
      );
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),

  create: trycatcher(
    async (
      req: IDecoratedRequest<IJobBase[], {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const Jobs = req.payload;
      // TODO: Переделать на нормальные методы
      // const res = await methods.create(Jobs);
      const res = await Promise.all(
        Jobs.map(async r => await methods.createSingleJob(r))
      ) as any[];
      return utils.mapElementsToJSON(res);
    },
    { logMessage: `${routeName} create request`, isRequest: true }
  ),

  createSingleJob: trycatcher(
    async (
      req: IDecoratedRequest<IJobBase, {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const Job = req.payload;
      const res = await methods.createSingleJob(Job);
      return res;
      // return utils.mapElementsToJSON(res);
    },
    { logMessage: `${routeName} create single request`, isRequest: true }
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
      req: IDecoratedRequest<IJob[], {}, IUserCredentials>,
      h
    ): Promise<IJob[]> => {
      const Jobs = req.payload;
      const res = await methods.update(Jobs);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  )
};

export default ctrl;
