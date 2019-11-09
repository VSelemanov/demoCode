import { server } from "../../server";
import utils from "../../utils";
import {
  IJobBase,
  IJobInstance,
  IJob,
  IJobTree,
  IJobWithMeasure
} from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { attrFind as JobAttrs, routeName } from "./constants";
import { attrFind as MeasureAttrs } from "../Measure/constants";
import { Op } from "sequelize";
import uuid = require("uuid");
import SystemError from "general/SystemError";
import { ErrorCode } from "general/constants";
import { ErrorMessages as ResourceErrorMessages } from "../Resource/constants";

const methods = {
  create: trycatcher(
    async (rows: Array<IJobBase | IJob>): Promise<IJobInstance[] | null> => {
      const r = await utils.createRows<IJobBase | IJob, IJob>(rows, server.Job);

      return null;
    },
    { logMessage: `${routeName} create method` }
  ),
  createSingleJob: trycatcher(
    async (
      row: IJobBase & { ResourceGUID: string }
    ): Promise<IJobInstance | null> => {
      const Resource = await server.Resource.findByPk(
        row.ResourceGUID || uuid.v4()
      );

      const Job = await server.Job.create({
        ...row,
        ENIRGUID: "",
        GESNGUID: ""
      });

      if (Resource) {
        // @ts-ignore
        await Resource.addJob(Job);
      }

      return Job;
    },
    { logMessage: `${routeName} create single method` }
  ),
  read: trycatcher(
    async (
      ResourceGUID: string | null,
      isTree: boolean = false,
      GUIDs: string[] | undefined = undefined
    ): Promise<IJobWithMeasure[] | IJobTree[]> => {
      const where: { ResourceGUID?: string; GUID?: any } = {};
      let Jobs: IJobInstance[] | null = null;
      if (ResourceGUID) {
        const Resource = await server.Resource.findByPk(ResourceGUID);
        if (!Resource) {
          throw new SystemError({
            code: ErrorCode.BAD_REQUEST,
            message: `${ResourceErrorMessages.RESOURCE_NOT_FOUND} in read ${routeName} method`
          });
        }
        // @ts-ignore
        Jobs = await Resource.getJobs();
        // where.ResourceGUID = ResourceGUID;
      }
      if (GUIDs) {
        where.GUID = { [Op.in]: GUIDs };
      }

      const res: IJobWithMeasure[] = utils.mapElementsToJSON(
        Jobs ||
          (await server.Job.findAll({
            where,
            attributes: JobAttrs.default,
            include: [
              { model: server.Measure, attributes: MeasureAttrs.default }
            ],
            order: [["ClassificationCode", "ASC"]]
          }))
      ) as IJobWithMeasure[];

      res.sort((a, b) => {
        const CCa = a.ClassificationCode.toLowerCase();
        const CCb = b.ClassificationCode.toLowerCase();
        if (CCa < CCb) {
          return -1;
        }
        if (CCa > CCb) {
          return 1;
        }
        return 0;
      });

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
      return await utils.deleteRows(GUIDs, server.Job);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Jobs: IJob[]): Promise<IJobWithMeasure[]> => {
      const UPDJobsGUIDs: string[] = (await utils.updateRows<IJob>(
        Jobs,
        server.Job
      )).map((r: IJobInstance) => r.GUID);

      const UPDJobs = (await methods.read(
        null,
        false,
        UPDJobsGUIDs
      )) as IJobWithMeasure[];
      return UPDJobs;
    },
    { logMessage: `${routeName} update method` }
  )
};

export default methods;
