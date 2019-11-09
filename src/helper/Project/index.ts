import { server } from "../../server";
import { IProject, IProjectBase, IProjectInstance } from "./interfaces";
import utils from "../../utils";
import logger from "../../utils/logger";

import { IDecoratedRequest } from "core/Api/interfaces";
import SystemError from "general/SystemError";
import trycatcher from "../../utils/trycatcher";
import { attrFind, routeName } from "./constants";

import FacilityMethods from "../Facility";

import PlanFactMethods from "../PlanFact";
import {
  IFacilityFloorsComponentsSystemsPercents,
  IFacilitySimple
} from "../Facility/interfaces";

import { Op } from "sequelize";

const methods = {
  read: trycatcher(
    async credentials => {
      const Projects = utils.mapElementsToJSON(
        await server.Project.findAll({
          attributes: attrFind.default,
          order: [["name", "ASC"]],
          // @ts-ignore
          accContext: credentials,
          secDisable: credentials.admin
        })
      );
      const ProjectsWithPercents: IProjectWithPercents[] = await Promise.all(
        Projects.map(
          async (
            Project: IProject
          ): Promise<IProjectWithPercents & { Status: number }> => {
            // TODO: remove as
            const Facilities: IFacilitySimple[] = (await FacilityMethods.readList(
              Project.GUID,
              false,
              credentials
            )) as IFacilitySimple[];
            let maxStatus = 0;
            for (const Facility of Facilities) {
              if (maxStatus === 1) {
                continue;
              }
              if (Facility.Status && Facility.Status > maxStatus) {
                maxStatus = Facility.Status;
              }
              // if (
              //   Facility.Status &&
              //   Facility.Status < 4 &&
              //   Facility.Status > maxStatus
              // ) {
              //   maxStatus = Facility.Status;
              // }
            }

            return {
              ...Project,
              Status: maxStatus,
              FacilityCount: Facilities.length,
              ProjectPercent: PlanFactMethods.averagePercent(
                PlanFactMethods.getValues(Facilities, "FacilityPercent")
              )
            };
          }
        ) as Array<Promise<IProjectWithPercents & { Status: number }>>
      );

      return ProjectsWithPercents;
    },
    { logMessage: `${routeName} read method` }
  ),

  readAdmin: trycatcher(
    async (): Promise<IProject[]> => {
      const Projects = utils.mapElementsToJSON(
        await server.Project.findAll({
          attributes: attrFind.default
        })
      );

      return Projects;
    },
    { logMessage: `${routeName} read method` }
  ),
  createFormData: trycatcher(
    async (
      data: IProjectBase & { previewImg: any; mainImg: any }
    ): Promise<IProject[]> => {
      const project: IProjectBase = { ...data };
      if (data.previewImg && typeof data.previewImg !== "string") {
        project.previewImg = await utils.sendFileToCDN(data.previewImg);
      }
      if (data.mainImg && typeof data.mainImg !== "string") {
        project.mainImg = await utils.sendFileToCDN(data.mainImg);
      }

      return [await server.Project.create(project)];
    },
    {
      logMessage: `${routeName} create formdata method`,
      isRequest: true
    }
  ),
  create: trycatcher(
    async (rows: Array<IProjectBase | IProject>): Promise<IProject[]> => {
      const r = await utils.createRows<IProjectBase | IProject, IProject>(
        rows,
        server.Project
      );
      return utils.mapElementsToJSON(r);
    },
    { logMessage: `${routeName} create method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Project);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Projects: IProject[]): Promise<any> => {
      const UPDProjects = await utils.updateRows<IProject>(
        Projects,
        server.Project
      );
      return utils.mapElementsToJSON(UPDProjects);
    },
    { logMessage: `${routeName} update method` }
  ),
  updateFormData: trycatcher(
    async (
      data: IProject & { previewImg: any; mainImg: any }
    ): Promise<IProject[]> => {
      const project: IProject = { ...data };
      if (data.previewImg && typeof data.previewImg !== "string") {
        project.previewImg = await utils.sendFileToCDN(data.previewImg);
      }
      if (data.mainImg && typeof data.mainImg !== "string") {
        project.mainImg = await utils.sendFileToCDN(data.mainImg);
      }

      const res = await server.Project.update(project, {
        where: { GUID: project.GUID },
        returning: true
      });

      return res[1];
    },
    {
      logMessage: `${routeName} update formdata method`,
      isRequest: true
    }
  ),
  facilityCountReport: trycatcher(
    async (
      dateFrom: number,
      dateTo: number,
      ProjectGUID: string | null,
      credentials: any
    ): Promise<any> => {
      const start = new Date(dateFrom);
      const end = new Date(dateTo);
      const whereProjectGUID: { ProjectGUID?: string } = {};
      if (ProjectGUID) {
        whereProjectGUID.ProjectGUID = ProjectGUID;
      }

      const Projects = await server.Project.findAll({
        where: {
          ...whereProjectGUID,
          createdAt: {
            [Op.not]: null
          }
        },
        include: [
          {
            model: server.Facility,
            where: {
              [Op.and]: [
                {
                  createdAt: {
                    $gte: start
                  }
                },
                {
                  createdAt: {
                    $lte: end
                  }
                }
              ]
            }
          }
        ],
        // @ts-ignore
        accContext: credentials
      });

      return Projects.map(project => {
        return {
          ...project.toJSON(),
          Facilities: project.Facilities.length
        };
      });
    },
    {
      logMessage: `${routeName} update formdata method`,
      isRequest: true
    }
  )
};

interface IProjectWithPercents extends IProject {
  ProjectPercent: number | null;
}

export default methods;
