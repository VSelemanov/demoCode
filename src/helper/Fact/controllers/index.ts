import trycatcher from "../../../utils/trycatcher";
import {
  IFactBase,
  IFactInstance,
  IFact,
  IFactGetParams,
  IFactGetResponse,
  IGetPhotosPayload,
  IGetPhotosResponse
} from "../interfaces";
import uuid = require("uuid");
import { IDecoratedRequest } from "core/Api/interfaces";
import methods from "../index";
import utils from "../../../utils";
import { IUserCredentials, IUserAuthCredentials } from "../../User/interfaces";
import { routeName } from "../constants";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IFactGetParams, IUserCredentials>,
      h
    ): Promise<IFactGetResponse> => {
      const { ComponentGUID } = req.query;
      const res = await methods.read(ComponentGUID);
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),

  create: trycatcher(
    async (
      req: IDecoratedRequest<
        IFactBase & { photofact: any },
        {},
        IUserAuthCredentials
      >,
      h
    ): Promise<any> => {
      const {
        ComponentGUID,
        isResource,
        uploadedAt,
        value,
        Comment,
        Mark,
        // photofact,
        JobGUID
      } = req.payload;

      const photofacts = utils.getFilesFromPayload(req.payload, "photofact");

      // const photofacts = Object.keys(req.payload)
      //   .map(key => {
      //     if (key.includes("photofact")) {
      //       return req.payload[key];
      //     }
      //   })
      //   .filter(r => r);
      const res = await methods.create(
        [
          {
            ComponentGUID,
            isResource,
            uploadedAt,
            value,
            Comment,
            Mark,
            photofacts,
            JobGUID,
            UserGUID: req.auth.credentials.id || ""
          }
        ],
        req.auth.credentials
      );
      return utils.mapElementsToJSON(res)[0];
    },
    { logMessage: `${routeName} create request`, isRequest: true }
  ),
  // delete: trycatcher(
  //   async (
  //     req: IDecoratedRequest<string[], {}, IUserCredentials>,
  //     h
  //   ): Promise<string> => {
  //     const GUIDs = req.payload;
  //     const res = await methods.delete(GUIDs);
  //     return "ok";
  //   },
  //   {
  //     logMessage: `${routeName} delete request`,
  //     isRequest: true
  //   }
  // ),
  update: trycatcher(
    async (
      req: IDecoratedRequest<IFact[], {}, IUserCredentials>,
      h
    ): Promise<IFact[]> => {
      const Facts = req.payload;
      const res = await methods.update(Facts);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  ),

  getPhotos: trycatcher(
    async (
      req: IDecoratedRequest<{}, IGetPhotosPayload, IUserCredentials>,
      h
    ): Promise<IGetPhotosResponse> => {
      const objectGUID = req.query.objectGUID;
      const res = await methods.getPhotos(objectGUID);
      return res;
    },
    {
      logMessage: `${routeName} getPhotos request`,
      isRequest: true
    }
  )
};

export default ctrl;
