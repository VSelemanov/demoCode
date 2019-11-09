import { IBaseInstanceInfo, ICIMSModelBase } from "../../../interfaces";
import Sequelize from "sequelize";

/* 
    COMPONENT
*/

export interface IContactBaseFlds {
  ContactID: number;
  ContactRole: string;
  ExternalOfficeID: string;
  GivenName: string;
  FamilyName: string;
  OfficeName: string;
  OfficeDepartment?: string;
  OfficePrganizationCode?: string;
  AddressStreet: string;
  AddressPostalBox?: string;
  AddressTown: string;
  AddressStateRegion: string;
  AddressPostalCode: string;
  AddressCountry: string;
  ContactPhone: string;
  ContactFax?: string;
  ContactEmail: string;
}

export interface IContactBase extends IContactBaseFlds, ICIMSModelBase {}

export interface IContact extends IContactBase, IBaseInstanceInfo {}

export type IContactInstance = Sequelize.Instance<IContact> & IContact;
