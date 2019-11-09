import trycatcher from "../../../utils/trycatcher";
import {
  IGetFacility,
  IFacilitySimple,
  IFacility,
  IFacilityBase
} from "../interfaces";
import { IDecoratedRequest } from "core/Api/interfaces";
import { ErrorCode } from "general/constants";
import SystemError from "general/SystemError";
import methods from "../index";
import { IUserCredentials } from "../../User/interfaces";
import { ErrorMessages, routeName } from "../constants";
import { isSystemError } from "general/interfaces";
import Boom from "boom";
import utils from "../../../utils";

const ctrl = {
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IGetFacility, IUserCredentials>,
      h
    ): Promise<IFacilitySimple[] | any> => {
      const { GUID, ProjectGUID } = req.query;
      const { isMobile } = req.auth.credentials;
      let res: IFacilitySimple[] | any;
      if (GUID) {
        if (GUID[0] === "[") {
          res = Promise.all(
            JSON.parse(GUID).map(guid => {
              return methods.readSingle(guid, !!isMobile, req.auth.credentials);
            })
          );
        } else {
          res = await methods.readSingle(
            GUID,
            !!isMobile,
            req.auth.credentials
          );
        }
      } else if (ProjectGUID) {
        res = await methods.readList(
          ProjectGUID,
          !!isMobile,
          req.auth.credentials
        );
      } else {
        throw new SystemError({
          code: ErrorCode.BAD_REQUEST,
          message: ErrorMessages.FACILITY_ERROR_REQUEST
        });
      }
      return res;
    },
    { logMessage: `${routeName} read request`, isRequest: true }
  ),
  readAdmin: trycatcher(
    async (
      req: IDecoratedRequest<{}, { q?: string }, IUserCredentials>,
      h
    ): Promise<IFacility[]> => {
      const { q } = req.query;
      const res: IFacility[] = await methods.readAdmin(req.auth.credentials, q);
      return res;
    },
    {
      logMessage: `${routeName} admin read request`,
      isRequest: true
    }
  ),
  create: trycatcher(
    async (
      req: IDecoratedRequest<
        Array<IFacilityBase | IFacility>,
        {},
        IUserCredentials
      >,
      h
    ): Promise<IFacility[] | Boom> => {
      const Facilities = req.payload;
      // TODO: remove as
      const res: IFacility[] = (await methods.create(
        Facilities
      )) as IFacility[];
      return res;
    },
    { logMessage: `${routeName} create request`, isRequest: true }
  ),
  createFormData: trycatcher(
    async (
      req: IDecoratedRequest<IFacilityBase | IFacility, {}, IUserCredentials>,
      h
    ): Promise<IFacility[] | Boom> => {
      const facilityPhotos = utils.getFilesFromPayload(
        req.payload,
        "facilityPhoto"
      );

      // TODO: remove as
      const res = (await methods.createFormData(
        req.payload,
        facilityPhotos
      )) as IFacility[];
      return res;
    },
    { logMessage: `${routeName} create formdata request`, isRequest: true }
  ),
  factReport: trycatcher(
    async (
      req: IDecoratedRequest<
        {},
        { dateFrom: string; dateTo: string; FacilityGUID: string },
        IUserCredentials
      >,
      h
    ): Promise<string> => {
      const { dateFrom, dateTo, FacilityGUID } = req.query;
      const res = await methods.factReport(
        Date.parse(dateFrom),
        Date.parse(dateTo),
        FacilityGUID,
        req.auth.credentials
      );
      return res;
    },
    {
      logMessage: `${routeName} fact report request`,
      isRequest: true
    }
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
      req: IDecoratedRequest<IFacility[], {}, IUserCredentials>,
      h
    ): Promise<IFacility[]> => {
      const Facilities = req.payload;
      const res = await methods.update(Facilities);
      return res;
    },
    {
      logMessage: `${routeName} update request`,
      isRequest: true
    }
  ),
  updateFormData: trycatcher(
    async (
      req: IDecoratedRequest<IFacility[], {}, IUserCredentials>,
      h
    ): Promise<IFacility[] | Boom> => {
      const facilityPhotos = utils.getFilesFromPayload(
        req.payload,
        "facilityPhoto"
      );

      // TODO: fix types
      // @ts-ignore
      const res = await methods.updateFormData(req.payload, facilityPhotos);
      return res;
    },
    { logMessage: `${routeName} update formdata request`, isRequest: true }
  )
};

export default ctrl;
