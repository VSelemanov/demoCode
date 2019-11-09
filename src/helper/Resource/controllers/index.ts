import trycatcher from "../../../utils/trycatcher";
import {
  IResourceBase,
  IResourceWithMeasure,
  IResourceTree,
  IGetResource,
  IResource,
  IResourceLinkJob
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
      req: IDecoratedRequest<{}, IGetResource, IUserCredentials>,
      h
    ): Promise<IResourceTree[] | IResourceWithMeasure[]> => {
      const { isTree, includeJobs } = req.query;
      const res = await methods.read(isTree === "true", includeJobs === "true");
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),

  create: trycatcher(
    async (
      req: IDecoratedRequest<IResourceBase[], {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const Resources: IResourceBase[] = req.payload;
      const res = await methods.create(Resources);
      return utils.mapElementsToJSON(res);
    },
    { logMessage: `${routeName} create request`, isRequest: true }
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
      req: IDecoratedRequest<IResource[], {}, IUserCredentials>,
      h
    ): Promise<IResource[]> => {
      const Resources = req.payload;
      const res = await methods.update(Resources);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  ),
  linkJob: trycatcher(
    async (
      req: IDecoratedRequest<IResourceLinkJob, {}, IUserCredentials>,
      h
    ): Promise<any> => {
      const { ResourceGUID, JobGUIDs } = req.payload;
      const res = await methods.linkJob(ResourceGUID, JobGUIDs);
      return res;
    },
    {
      logMessage: `${routeName} link job request`,
      isRequest: true
    }
  )
};

export default ctrl;
