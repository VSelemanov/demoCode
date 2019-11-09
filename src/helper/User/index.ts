import Boom from "boom";
import { server } from "../../server";
import {
  IUpdateUser,
  IGetUser,
  IUserProps,
  IGetUserByOrgId
} from "./interfaces";
import logger from "../../utils/logger";
// import User from "../database/model";

import SystemError from "general/SystemError";
import sequelize = require("sequelize");

import UserSchema from "./database/models";
import { ErrorMessages, routeName } from "./constants";
import trycatcher from "../../utils/trycatcher";

// TODO: Вынести в функции повторяющийся код

const UserCtrl = {
  create: trycatcher(
    async (userData: IUserProps) => {
      const res = await server.User.upsert(
        {
          ...userData,
          isActive: UserSchema.isActive.defaultValue,
          isDeleted: UserSchema.isDeleted.defaultValue
        },
        {
          returning: true,
          fields: ["orgId", "token", "isDeleted", "isActive"]
        }
      );

      if (!res) {
        logger.error("create user db error --> ", res);
        throw new Error(ErrorMessages.USER_ADD);
      }

      return res;
    },
    { logMessage: `${routeName} create method` }
  ),
  update: trycatcher(
    async (userData: IGetUserByOrgId, newData: IUpdateUser) => {
      const { orgId } = userData;

      const res = await server.User.update(
        {
          ...newData
        },
        {
          where: {
            orgId
          },
          fields: ["isActive", "isDeleted"]
        }
      );
      if (!res) {
        throw new Error(ErrorMessages.USER_UPDATE);
      }
      return res;
    },
    { logMessage: `${routeName} update method` }
  ),
  get: trycatcher(
    async (userData: IGetUser) => {
      const where: IGetUser = {};
      // TODO: Разобраться чё за
      Object.keys(userData).map(key => {
        where[key] = userData[key];
      });

      const res = await server.User.findOne({
        where
      });

      if (!res) {
        throw new Error(ErrorMessages.USER_GET);
      }

      return res;
    },
    { logMessage: `${routeName} get method` }
  )
};

export default UserCtrl;
