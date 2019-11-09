import { server } from "../../server";
import { Op } from "sequelize";
import utils from "../../utils";
import {
  IFacilityBase,
  IFacilityInstance,
  IFacility,
  IFacilitySimple,
  IFacilityFloorsComponentsSystemsPercents,
  IFacilityPhotoItemInstance
} from "./interfaces";
import trycatcher from "../../utils/trycatcher";
import SystemError from "general/SystemError";
import { ErrorCode } from "general/constants";
import { IncludeOptions } from "sequelize";
import {
  attrFind as FacilityAttr,
  ErrorMessages,
  routeName
} from "./constants";
import { attrFind as ComponentAttr } from "../Component/constants";
import { attrFind as FloorAttr } from "../Floor/constants";
import { attrFind as SpaceAttr } from "../Space/constants";
import { attrFind as SystemAttr } from "../System/constants";
import { attrFind as RegisterAttr } from "../Register/constants";
import { attrFind as ResourceAttr } from "../Resource/constants";
import { attrFind as JobAttr } from "../Job/constants";
import { attrFind as MeasureAttr } from "../Measure/constants";

import PlanFactMethods from "../PlanFact";
import { IUserCredentials } from "../User/interfaces";
import { IComponent } from "../Component/interfaces";
import moment = require("moment");

const methods = {
  readAdmin: trycatcher(
    async (credentials, q?: string): Promise<IFacility[]> => {
      const like = q ? `%${q}%` : "%";
      const Facilities = await server.Facility.findAll({
        where: {
          FacilityName: {
            [Op.like]: like
          }
        },
        attributes: FacilityAttr.default,
        // @ts-ignore
        secDisable: credentials.admin
      });

      return Facilities;
    },
    {
      logMessage: `${routeName} admin read method`
    }
  ),
  create: trycatcher(
    async (
      rows: Array<IFacilityBase | IFacility>
    ): Promise<IFacilityInstance[]> => {
      const r = await utils.createRows<IFacilityBase | IFacility, IFacility>(
        rows,
        server.Facility
        // { logging: true }
      );
      return r;
    },
    { logMessage: `${routeName} create method` }
  ),
  createFormData: trycatcher(
    async (
      data: IFacilityBase & { mainImg: any },
      facilityPhotos: any[]
    ): Promise<IFacility[]> => {
      const facility: IFacilityBase = { ...data };
      if (data.mainImg && typeof data.mainImg !== "string") {
        facility.mainImg = await utils.sendFileToCDN(data.mainImg);
      }

      const Facility = await server.Facility.create(facility);

      await methods.createFacilityPhoto(Facility.GUID, facilityPhotos);

      return [Facility];
    },
    {
      logMessage: `${routeName} create formdata method`,
      isRequest: true
    }
  ),
  createFacilityPhoto: trycatcher(
    async (
      FacilityGUID: string,
      photos: any[]
    ): Promise<IFacilityPhotoItemInstance[]> => {
      const FacilityPhotoItems: IFacilityPhotoItemInstance[] = [];
      for (const photo of photos) {
        const url = await utils.sendFileToCDN(photo);
        await server.FacilityPhotoItem.create({
          FacilityGUID,
          url
        });
      }
      return FacilityPhotoItems;
    },
    {
      logMessage: `${routeName} create facility photo method`
    }
  ),
  readList: trycatcher(
    async (
      ProjectGUID: string,
      isMobile: boolean = false,
      credentials
    ): Promise<IFacilitySimple[]> => {
      const where: any = {};
      if (ProjectGUID !== "null" && ProjectGUID !== null) {
        where.ProjectGUID = ProjectGUID;
      }
      const Facilities: IFacility[] = utils.mapElementsToJSON(
        await server.Facility.findAll({
          where,
          attributes: isMobile
            ? FacilityAttr.simpleMobile
            : FacilityAttr.simple,
          // @ts-ignore
          accContext: credentials,
          secDisable: credentials.admin
        })
      );

      const res: IFacilitySimple[] = await Promise.all(
        Facilities.map(
          async (Facility): Promise<IFacilitySimple> => {
            // TODO: remove as
            const FacilityPlanFact: IFacilityFloorsComponentsSystemsPercents = (await PlanFactMethods.planfact(
              Facility.GUID,
              credentials
            )) as IFacilityFloorsComponentsSystemsPercents;

            return {
              ...Facility,
              FacilityPercent: FacilityPlanFact.FacilityPercent
            };
          }
        )
      );

      return res;
    },
    { logMessage: `${routeName} read list method` }
  ),
  readSingle: trycatcher(
    async (
      GUID: string,
      isMobile: boolean = false,
      credentials = {}
    ): Promise<IFacility> => {
      const attrs = {
        Facility: isMobile ? FacilityAttr.defaultMobile : FacilityAttr.default,
        Floor: isMobile ? FloorAttr.mobile : FloorAttr.default,
        Space: isMobile ? SpaceAttr.mobile : SpaceAttr.default,
        System: isMobile ? SystemAttr.mobile : SystemAttr.default,
        Component: isMobile ? ComponentAttr.mobile : ComponentAttr.default,
        Register: isMobile ? RegisterAttr.mobile : RegisterAttr.default,
        Resource: isMobile ? ResourceAttr.mobile : ResourceAttr.default,
        Job: isMobile ? JobAttr.mobile : JobAttr.default,
        Measure: MeasureAttr.default,
        FacilityPhotoItem: FacilityAttr.FacilityPhotoItemDefault
      };

      await PlanFactMethods.planfact(GUID, credentials);

      const includeComponent: IncludeOptions = {
        model: server.Component,
        attributes: ComponentAttr.default
      };

      // TODO: продумать глубокие инклуды
      const res = await server.Facility.findByPk(GUID, {
        attributes: attrs.Facility,
        include: [
          {
            model: server.FacilityPhotoItem,
            attributes: attrs.FacilityPhotoItem
          },
          {
            model: server.Floor,
            attributes: attrs.Floor,
            include: [
              {
                model: server.Space,
                attributes: attrs.Space,
                include: [
                  {
                    ...includeComponent,
                    include: [
                      {
                        model: server.Register,
                        attributes: attrs.Register,
                        include: [
                          {
                            model: server.Resource,
                            attributes: attrs.Resource,
                            include: [
                              {
                                model: server.Job,
                                attributes: attrs.Job,
                                include: [
                                  {
                                    model: server.Measure,
                                    attributes: attrs.Measure
                                  }
                                ]
                              },
                              {
                                model: server.Measure,
                                attributes: attrs.Measure
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    model: server.System,
                    attributes: SystemAttr.default,
                    include: [
                      {
                        ...includeComponent,
                        include: [
                          {
                            model: server.Register,
                            attributes: attrs.Register,
                            include: [
                              {
                                model: server.Resource,
                                attributes: attrs.Resource,
                                include: [
                                  {
                                    model: server.Job,
                                    attributes: attrs.Job,
                                    include: [
                                      {
                                        model: server.Measure,
                                        attributes: attrs.Measure
                                      }
                                    ]
                                  },
                                  {
                                    model: server.Measure,
                                    attributes: attrs.Measure
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                ...includeComponent,
                include: [
                  {
                    model: server.Register,
                    attributes: attrs.Register,
                    include: [
                      {
                        model: server.Resource,
                        attributes: attrs.Resource,
                        include: [
                          {
                            model: server.Job,
                            attributes: attrs.Job,
                            include: [
                              {
                                model: server.Measure,
                                attributes: attrs.Measure
                              }
                            ]
                          },
                          {
                            model: server.Measure,
                            attributes: attrs.Measure
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                model: server.System,
                attributes: SystemAttr.default,
                include: [
                  {
                    ...includeComponent,
                    include: [
                      {
                        model: server.Register,
                        attributes: attrs.Register,
                        include: [
                          {
                            model: server.Resource,
                            attributes: attrs.Resource,
                            include: [
                              {
                                model: server.Job,
                                attributes: attrs.Job,
                                include: [
                                  {
                                    model: server.Measure,
                                    attributes: attrs.Measure
                                  }
                                ]
                              },
                              {
                                model: server.Measure,
                                attributes: attrs.Measure
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            ...includeComponent,
            include: [
              {
                model: server.Register,
                attributes: attrs.Register,
                include: [
                  {
                    model: server.Resource,
                    attributes: attrs.Resource,
                    include: [
                      {
                        model: server.Job,
                        attributes: attrs.Job,
                        include: [
                          {
                            model: server.Measure,
                            attributes: attrs.Measure
                          }
                        ]
                      },
                      {
                        model: server.Measure,
                        attributes: attrs.Measure
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: server.System,
            attributes: SystemAttr.default,
            include: [
              {
                ...includeComponent,
                include: [
                  {
                    model: server.Register,
                    attributes: attrs.Register,
                    include: [
                      {
                        model: server.Resource,
                        attributes: attrs.Resource,
                        include: [
                          {
                            model: server.Job,
                            attributes: attrs.Job,
                            include: [
                              {
                                model: server.Measure,
                                attributes: attrs.Measure
                              }
                            ]
                          },
                          {
                            model: server.Measure,
                            attributes: attrs.Measure
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        order: [
          [server.Component, orderFlds.Component],
          [server.Floor, orderFlds.Floor],
          [server.System, orderFlds.System],
          [server.System, server.Component, orderFlds.Component],

          [server.Floor, server.Space, orderFlds.Space],
          [server.Floor, server.Component, orderFlds.Component],
          [server.Floor, server.System, orderFlds.System],
          [server.Floor, server.System, server.Component, orderFlds.Component],

          [server.Floor, server.Space, server.Component, orderFlds.Component],
          [server.Floor, server.Space, server.System, orderFlds.System],
          [
            server.Floor,
            server.Space,
            server.System,
            server.Component,
            orderFlds.Component
          ]
        ],
        // @ts-ignore
        accContext: credentials
      });
      if (!res) {
        throw new SystemError({
          code: ErrorCode.NOT_FOUND,
          message: ErrorMessages.FACILITY_NOT_FOUND
        });
      }

      // @ts-ignore
      return utils.mapElementsToJSON([res])[0];
    },
    { logMessage: `${routeName} read single method` }
  ),
  read: () => {
    console.log();
  },
  factReport: trycatcher(
    async (
      dateFrom: number,
      dateTo: number,
      FacilityGUID: string,
      credentials: any = {}
    ): Promise<any> => {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);

      await PlanFactMethods.planfact(FacilityGUID, credentials);

      const Facts: any = utils.mapElementsToJSON(
        await server.Fact.findAll({
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
          ],
          // logging: console.log,
          where: {
            createdAt: {
              $gte: new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
              ),
              $lte: new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
                23,
                59,
                59
              )
            },
            $or: [
              { "$Component.Facility.GUID$": FacilityGUID },
              { "$Component.Floor.Facility.GUID$": FacilityGUID },
              { "$Component.Space.Floor.Facility.GUID$": FacilityGUID }
            ]
          }
        })
      );

      const Jobs: any = {};

      for (const Fact of Facts) {
        if (Fact.Job) {
          if (!Jobs[Fact.Job.GUID]) {
            Jobs[Fact.Job.GUID] = {
              name: Fact.Job.JobName,
              measure: {
                measureName: Fact.Job.Measure.MeasureName
              },
              facts: {}
            };
          }
          const createdAt = new Date(Fact.createdAt);
          const someDate = Date.UTC(
            createdAt.getFullYear(),
            createdAt.getMonth(),
            createdAt.getDate()
          );
          if (!Jobs[Fact.Job.GUID].facts[someDate]) {
            Jobs[Fact.Job.GUID].facts[someDate] = 0;
          }
          Jobs[Fact.Job.GUID].facts[someDate] += Fact.value;
        }
      }

      const JobsForReturn = Object.keys(Jobs).map(JobKey => {
        let total = 0;
        return {
          GUID: JobKey,
          name: Jobs[JobKey].name,
          measure: Jobs[JobKey].measure,
          facts: Object.keys(Jobs[JobKey].facts).map(FactKey => {
            total += Jobs[JobKey].facts[FactKey];
            return {
              date: FactKey,
              value: Jobs[JobKey].facts[FactKey]
            };
          }),
          total
        };
      });

      // console.log({ startDate });
      // console.log({ endDate });

      // console.log({ JobsForReturn });

      return {
        dateFrom,
        dateTo,
        jobs: JobsForReturn
      };

      /*return {
        dateFrom: Date(),
        dateTo: Date(),
        jobs: [
          {
            name: "Укладка компьютерной техники",
            measure: {
              measureName: "м3"
            },
            facts: [
              {
                date: Date(),
                value: 19
              },
              {
                date: Date(),
                value: 23
              },
              {
                date: Date(),
                value: 18
              }
            ]
          },

          {}
        ]
      };*/
    },
    { logMessage: `${routeName} fact report method` }
  ),
  delete: trycatcher(
    async (GUIDs: string[]): Promise<boolean> => {
      return await utils.deleteRows(GUIDs, server.Facility);
    },
    { logMessage: `${routeName} delete method` }
  ),
  update: trycatcher(
    async (Facilities: IFacility[]): Promise<any> => {
      const UPDFacilities = await utils.updateRows<IFacility>(
        Facilities,
        server.Facility
      );
      return utils.mapElementsToJSON(UPDFacilities);
    },
    { logMessage: `${routeName} update method` }
  ),
  updateFormData: trycatcher(
    async (
      data: IFacility & { mainImg: any },
      facilityPhotos: any[] = []
    ): Promise<IFacility[]> => {
      const facility: IFacility = { ...data };

      if (data.mainImg && typeof data.mainImg !== "string") {
        facility.mainImg = await utils.sendFileToCDN(data.mainImg);
      }

      const res = await server.Facility.update(facility, {
        where: { GUID: facility.GUID },
        returning: true
      });

      await methods.createFacilityPhoto(data.GUID, facilityPhotos);

      return res[1];
    },
    {
      logMessage: `${routeName} update formdata method`,
      isRequest: true
    }
  )
};

enum orderFlds {
  System = "SystemID",
  Component = "ComponentID",
  Floor = "FloorID",
  Space = "SpaceID",
  Register = "RegisterD"
}

export default methods;
