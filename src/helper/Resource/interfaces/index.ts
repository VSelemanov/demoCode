import { IBaseInstanceInfo, IGetEntityByTree } from "../../../interfaces";
import Sequelize from "sequelize";
import { IMeasure } from "../../Measure/interfaces";
import { IJob, IJobWithMeasure } from "../../Job/interfaces";

/* 
    Resource
*/

export interface IResourceBaseFlds {
  KSRGUID: string | null;
  ClassificationID: number | null;
  ResourceName: string;
  ResourceID?: number;
  ClassificationCode: string;
}

export interface IResourceBase extends IResourceBaseFlds {
  ParentGUID: string | null;
  MeasureGUID: string | null;
}

export interface IResource extends IResourceBase, IBaseInstanceInfo {}

export interface IResourceWithMeasure extends IResource {
  Measure: IMeasure | null;
}
export interface IResourceTree extends IResourceWithMeasure {
  children: IResourceTree[];
}

export interface IResourceForCIMS extends IResourceBaseFlds {
  ResourceIDPick: string;
}

export interface IGetResource extends IGetEntityByTree {
  includeJobs: string;
}

export interface IResourceWithJob extends IResourceWithMeasure {
  Jobs: IJobWithMeasure[];
}

export type IResourceInstance = Sequelize.Instance<IResource> & IResource;

export interface IResourceLinkJob {
  ResourceGUID: string;
  JobGUIDs: string[];
}
