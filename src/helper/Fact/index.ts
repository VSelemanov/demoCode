import { server } from "../../server";
import utils from "../../utils";
import logger from "../../utils/logger";
import axios from "axios";
import {
  IFactBase,
  IFactInstance,
  IFact,
  IFactGetResponse,
  IGetPhotosResponse,
  IPreparedPhoto,
  IPhotoFactInstance
} from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import { attrFind, routeName } from "./constants";
import { usersURI, usersToken } from "../../constants";
import PlanFactMethods from "../PlanFact";

const methods = {
  create: trycatcher(
    async (
      rows: Array<
        IFactBase & { photofacts?: any[] } | IFact & { photofacts?: any[] }
      >,
      credentials: any = {}
    ): Promise<IFactInstance[]> => {
      const r = await utils.createRows<IFactBase | IFact, IFact>(
        rows,
        server.Fact
      );

      const Component = await server.Component.findByPk(r[0].ComponentGUID, {
        include: [
          {
            model: server.Register,
            include: [
              {
                model: server.Facility
              }
            ]
          }
        ],
        // @ts-ignore
        secDisable: true
      });

      await PlanFactMethods.planfact(
        // @ts-ignore
        Component.Register.Facility.GUID,
        credentials
      );

      await logger.info("rows prepared", r);
      if (
        rows.length &&
        rows[0].photofacts &&
        typeof rows[0].photofacts !== "string" &&
        Array.isArray(rows[0].photofacts)
      ) {
        for (const photofact of rows[0].photofacts) {
          logger.info("sending to cdn");
          const link = await utils.sendFileToCDN(photofact);
          logger.info("link here", link);
          const pf = await server.PhotoFact.create({
            FactGUID: r[0].GUID,
            Photo: link
          });
          logger.info("photofact -->", pf);
        }
      }
      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  read: trycatcher(
    async (ComponentGUID: string): Promise<IFactGetResponse> => {
      const facts: Array<IFact & { user?: any }> = utils.mapElementsToJSON(
        await server.Fact.findAll({
          where: {
            ComponentGUID
          },
          attributes: attrFind.default,
          include: [
            {
              model: server.PhotoFact,
              attributes: attrFind.photoFact
            }
          ]
        })
      );

      const userGUIDs = facts.map(r => r.UserGUID).filter(r => r);

      const Users = await axios.get(
        `${usersURI}?ids=${JSON.stringify(userGUIDs)}`,
        {
          headers: {
            Authorization: usersToken
          }
        }
      );

      for (const fact of facts) {
        fact.user = Users.data.find(r => r._id === fact.UserGUID) || null;
      }

      const res: IFactGetResponse = {
        JobFacts: methods.FactFilter(facts, false),
        ResourceFacts: methods.FactFilter(facts, true)
      };

      return res;
    },
    { logMessage: `${routeName} read method` }
  ),

  update: trycatcher(
    async (Facts: IFact[]): Promise<any> => {
      const UPDFacts = await utils.updateRows<IFact>(Facts, server.Fact);
      return utils.mapElementsToJSON(UPDFacts);
    },
    { logMessage: `${routeName} update method` }
  ),

  getPhotos: trycatcher(
    async (projectGUID: string): Promise<IGetPhotosResponse> => {
      const photoFacts = await server.PhotoFact.findAll({
        include: [
          {
            model: server.Fact,
            include: [
              {
                model: server.Component,
                include: [
                  {
                    model: server.Facility
                  },
                  {
                    model: server.Floor,
                    include: [{ model: server.Facility }]
                  },
                  {
                    model: server.Space,
                    include: [
                      {
                        model: server.Floor,
                        include: [{ model: server.Facility }]
                      }
                    ]
                  }
                ]
              },
              {
                model: server.Job,
                include: [
                  {
                    model: server.Measure
                  }
                ]
              }
            ]
          }
        ],
        // logging: logger.info,
        where: {
          $or: [
            { "$Fact.Component.Facility.GUID$": projectGUID },
            { "$Fact.Component.Floor.Facility.GUID$": projectGUID },
            { "$Fact.Component.Space.Floor.Facility.GUID$": projectGUID }
          ]
        }
      });
      return {
        photos: photoFacts.map(el => methods.preparePhoto(el))
      };
    }
  ),

  preparePhoto(el: IPhotoFactInstance): IPreparedPhoto {
    // @ts-ignore
    const Fact = el.Fact;
    const Component = Fact.Component;
    const Job = Fact.Job;
    return {
      createdAt: el.createdAt,
      url: el.Photo,
      ComponentName: Component.ComponentName,
      JobName: Job ? Job.JobName : "",
      FactValue: Fact.value,
      Comment: Fact.Comment || "",
      MeasureName: Job ? Job.Measure.MeasureName : ""
    };
  },

  FactFilter: (facts: IFact[], isResource: boolean) => {
    return facts.filter(r => r.isResource === isResource);
  }
};

export default methods;
