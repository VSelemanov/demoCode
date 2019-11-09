import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";

/* *
 *  User
 * */
export interface IUserProps {
  orgId: string;
  token: string;
}

export interface IUpdateUser {
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface IUserAttributes {
  isActive: boolean;
  isDeleted: boolean;
}

export interface IUserBase extends IUserProps, IUserAttributes {}

export interface IUser extends IUserProps, IUserAttributes, IBaseInstanceInfo {}

export type IUserInstance = Sequelize.Instance<IUser> & IUser;

export interface IGetUser {
  orgId?: string;
  token?: string;
}

export interface IGetUserByOrgId {
  orgId: string;
}

export interface IUserCredentials {
  GUID: string;
  orgId: string;
  token: string;
  isMobile?: boolean;
}

export interface IUserAuthCredentials {
  id: string;
  orgId: string;
  isMobile: boolean;
  prpjects: string[];
}
