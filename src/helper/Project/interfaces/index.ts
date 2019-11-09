import { IBaseInstanceInfo } from "../../../interfaces";
import Sequelize from "sequelize";

/* *
 *   Project
 * */

export interface IProjectBase {
  name: string;
  description?: string;
  code?: string;
  previewImg?: string | null;
  mainImg?: string | null;
  region: string | null;
  town: string | null;
  street: string | null;
  FacilityCount: number | null;
  totalArea: number | null;
  ProjectStatus?: string | null;
  PlanFacilities: number;
}

export interface IProject extends IProjectBase, IBaseInstanceInfo {}

export type IProjectInstance = Sequelize.Instance<IProject> & IProject;
