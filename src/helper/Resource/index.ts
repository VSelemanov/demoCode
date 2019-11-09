import { server } from "../../server";
import utils from "../../utils";
import {
  IResourceBase,
  IResourceInstance,
  IResource,
  IResourceWithMeasure,
  IResourceTree
} from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import {
  attrFind as ResourceAttrs,
  routeName,
  attrFind,
  ErrorMessages
} from "./constants";
import { attrFind as MeasureAttrs } from "../Measure/constants";
import { attrFind as JobAttrs } from "../Job/constants";
import { Op } from "sequelize";

import CIMSMethods from "../CIMS";
import SystemError from "general/SystemError";
import { ErrorCode } from "general/constants";

const methods = {
  create: trycatcher(
    async (
      rows: Array<IResourceBase | IResource>
    ): Promise<IResourceInstance[]> => {
      const Resources = await utils.createRows<
        IResourceBase | IResource,
        IResource
      >(rows, server.Resource);

      // await CIMSMethods.updateCIMSTemplate();

      return Resources;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: trycatcher(
    async (
      isTree: boolean = false,
      includeJobs: boolean = false,
      GUIDs: string[] | undefined = undefined
    ): Promise<IResourceWithMeasure[] | IResourceTree[]> => {
      const where: { ResourceGUID?: string; GUID?: any } = {};
      if (GUIDs) {
        where.GUID = { [Op.in]: GUIDs };
      }
      const includeModels: Array<{
        model: any;
        attributes?: any;
        include?: any;
        order?: any;
      }> = [{ model: server.Measure, attributes: MeasureAttrs.default }];
      if (includeJobs) {
        includeModels.push({
          attributes: JobAttrs.default,
          model: server.Job,
          include: [
            { model: server.Measure, attributes: MeasureAttrs.default }
          ],
          order: ["ClassificationCode"]
        });
      }

      const Resources = await server.Resource.findAll({
        where,
        attributes: ResourceAttrs.default,
        include: includeModels,
        // logging: logger.info,
        order: ["ClassificationCode"]
      });

      // TODO: Костыль всех костылей для реализации связи many to many
      const ResourcesWithJobs = await Promise.all(
        Resources.map(async r => ({
          ...r.toJSON(),
          // @ts-ignore
          Jobs: await r.getJobs()
        }))
      );

      // const res: IResourceWithMeasure[] = utils.mapElementsToJSON(
      //   ResourcesWithJobs
      // ) as IResourceWithMeasure[];

      const res: IResourceWithMeasure[] = ResourcesWithJobs as any;

      // logger.info({ t: JSON.stringify(Resources, null, 4) });
      if (isTree) {
        return utils.tree(
          res.filter(r => r.ParentGUID === null),
          res,
          "GUID",
          "ParentGUID"
        );
      }

      return res;
    },
    { logMessage: `${routeName} read method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Resource);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Resources: IResource[]): Promise<IResourceWithMeasure[]> => {
      const UPDJobsGUIDs: string[] = (await utils.updateRows<IResource>(
        Resources,
        server.Resource
      )).map((r: IResourceInstance) => r.GUID);

      const UPDJobs = (await methods.read(
        null,
        false,
        UPDJobsGUIDs
      )) as IResourceWithMeasure[];
      return UPDJobs;
    },
    { logMessage: `${routeName} update method` }
  ),
  linkJob: trycatcher(
    async (ResourceGUID: string, JobGUIDs: string[]): Promise<any> => {
      const Resource = await server.Resource.findByPk(ResourceGUID, {
        include: [
          {
            model: server.Job
          }
        ]
      });
      if (!Resource) {
        throw new SystemError({
          code: ErrorCode.NOT_FOUND,
          message: ErrorMessages.RESOURCE_NOT_FOUND
        });
      }
      // @ts-ignore
      for (const Job of Resource.Jobs) {
        // @ts-ignore
        await Resource.removeJob(Job);
      }

      const Jobs = await server.Job.findAll({
        where: {
          GUID: { [Op.in]: JobGUIDs }
        }
      });

      for (const Job of Jobs) {
        // @ts-ignore
        await Resource.addJob(Job);
      }

      return "ok";
    },
    { logMessage: `${routeName} link job method` }
  )
};

export default methods;
