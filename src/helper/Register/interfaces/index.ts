import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";

/* 
    REGISTER
*/

export interface IRegisterBaseFlds {
  FacilityGUID: string;
  ProductType: string;
  RegisterType: string;
  AssetType: string;
  RegisterApprovalBy: string;
  RegisterID: number;

  SystemIDList?: string;
  SpaceIDList?: string;

  RegisterName: string;
  RegisterReference: string;
  ReplacementCost?: number;
  ReplacementCostUnit?: string;
  ExpectedLife?: string;
  ExpectedLifeUnit?: string;

  ResourceGUID: string;
}

export interface IRegisterBase extends IRegisterBaseFlds, ICIMSModelBase {}

export interface IRegister extends IRegisterBase, IBaseInstanceInfo {}

export type IRegisterInstance = Sequelize.Instance<IRegister> & IRegister;
