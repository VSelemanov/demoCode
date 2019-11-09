import UserCtrl from "../helper/User";
import { isSystemError } from "general/interfaces";
import logger from "../utils/logger";
import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";
import uuid = require("uuid");

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    const credentials = {};
    const isValid = token === process.env.APP_TOKEN;
    return { isValid, credentials };
  },
  UserAuth: async (request, user_token: string, h) => {
    try {
      const user = await UserCtrl.get({ token: user_token });
      if (isSystemError(user)) {
        throw user;
      }
      let isValid: boolean = false;
      let credentials = {};
      if (user !== null) {
        const { isActive, isDeleted, orgId, token, GUID } = user;
        isValid = isActive && !isDeleted;
        if (isValid) {
          credentials = { orgId, token, GUID };
        }
      } else {
        isValid = false;
      }
      return { isValid, credentials };
      // return { isValid: true, credentials: {} };
    } catch (error) {
      logger.error("UserAuth --> ", error);
      return { isValid: false, credentials: {} };
    }
  },
  UserJWTAuth: trycatcher(async (request, userJwt: string, h) => {
    try {
      const secretKey = process.env.SECRET_TOKEN || "";
      if (process.env.APP_STATUS === "dev") {
        return {
          isValid: true,
          credentials: {
            id: "5cde92fc74fadd9e9015eb7c",
            projects: ["13417b61-2fc4-4bcf-b2b3-b3aade3e7a0e"]
          }
        };
      }

      const jwtDecoded = jwt.verify(userJwt, secretKey) as { token: string };

      return { isValid: true, credentials: jwtDecoded };
    } catch (error) {
      logger.error("User JWTAuth --> ", error);
      return { isValid: false, credentials: {} };
    }
  }),
  AdminJWTAuth: trycatcher(async (request, adminJwt: string, h) => {
    const secretKey = process.env.ADMIN_SECRET_TOKEN || "";

    try {
      if (process.env.APP_STATUS === "dev") {
        return {
          isValid: true,
          credentials: {}
        };
      }

      const jwtDecoded = jwt.verify(adminJwt, secretKey) as { token: string };

      return { isValid: true, credentials: { ...jwtDecoded, admin: true } };
    } catch (error) {
      logger.error("Admin JWTAuth --> ", secretKey, error);
      return { isValid: false, credentials: {} };
    }
  })
};

export default Auth;
