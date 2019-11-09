import trycatcher from "../../utils/trycatcher";
import { routeName } from "../System/constants";
import { server } from "../../server";
import {
  attrFind as FacilityAttrFind,
  ErrorMessages
} from "../Facility/constants";
import SystemError from "general/SystemError";
import { ErrorCode } from "general/constants";
import { attrFind as FactAttrFind } from "../Fact/constants";
import { attrFind as PlanAttrFind } from "../Plan/constants";
import { attrFind as FloorAttrFind } from "../Floor/constants";
import { attrFind as SpaceAttrFind } from "../Space/constants";
import { attrFind as MeasureAttrFind } from "../Measure/constants";
import utils from "../../utils";
import {
  IComponentPlanFact,
  IComponentPlanFactPercents,
  IComponentPlanFactNew
} from "../Component/interfaces";
import { IFact } from "../Fact/interfaces";
import { ISystemComponentsPercents, ISystem } from "../System/interfaces";
import { IFacilityFloorsComponentsSystemsPercents } from "../Facility/interfaces";
import {
  IFloorSpacesSystemsComponentsPercents,
  IFloor
} from "../Floor/interfaces";

import { ISpaceSystemsComponentsPercents, ISpace } from "../Space/interfaces";

const methods = {
  planfact: trycatcher(
    async (
      FacilityGUID: string,
      credentials
    ): Promise<
      IFacilityFloorsComponentsSystemsPercents &
        IComponentsDeviationValues &
        IDeviationValues & {
          ComponentsStatus: number | null;
          ComponentsPercent: number | null;
        }
    > => {
      const FacilityInstance = await server.Facility.findByPk(FacilityGUID, {
        attributes: FacilityAttrFind.default,

        // @ts-ignore
        accContext: credentials
      });

      if (!FacilityInstance) {
        throw new SystemError({
          code: ErrorCode.NOT_FOUND,
          message: ErrorMessages.FACILITY_NOT_FOUND
        });
      }

      const Facility = FacilityInstance.toJSON();

      const where = { FacilityGUID: Facility.GUID };
      // TODO: remove as
      const Systems: IGetSystemsResponse = (await methods.getSystems(
        where,
        credentials,
        false
      )) as IGetSystemsResponse;
      // TODO: remove as
      const Components: IGetComponentsResponse = (await methods.getComponents(
        where,
        credentials,
        false
      )) as IGetComponentsResponse;
      // TODO: remove as
      const Floors: IGetFloorsResponse = (await methods.getFloors(
        where,
        credentials
      )) as IGetFloorsResponse;

      const FacilityPercent = methods.averagePercent([
        ...methods.getValues(Systems.Systems, PercentFlds.System),
        Components.averagePercent,
        ...methods.getValues(Floors.Floors, PercentFlds.Floor)
      ]);

      const Status = methods.statusRaiseUp(
        methods.averageStatus([
          ...methods.getValues(Systems.Systems, StatusFld),
          Components.averageStatus,
          ...methods.getValues(Floors.Floors, StatusFld)
        ]),
        FacilityPercent,
        Facility.finishedAt
      );

      if (Facility.Status !== Status) {
        Facility.Status = Status;
        await server.Facility.update(
          {
            Status
          },
          {
            where: {
              GUID: Facility.GUID
            }
          }
        );
      }

      const deviations = methods.calcDeviations(
        Facility.startedAt,
        Facility.finishedAt,
        FacilityPercent
      );

      const ComponentsDeviations = methods.calcDeviations(
        Facility.startedAt,
        Facility.finishedAt,
        Components.averagePercent
      );

      // TODO: Убрать ts-ignore и as
      return {
        ...Facility,
        Components: Components.Components,
        Systems: Systems.Systems,
        Floors: Floors.Floors,
        FacilityPercent,
        ...deviations,

        ComponentsDeviationDays: ComponentsDeviations.deviationDays,
        ComponentsDeviationPercents: ComponentsDeviations.deviationPercents,
        ComponentsStatus: Components.averageStatus,
        ComponentsPercent: Components.averagePercent
      };
    },
    {
      logMessage: `${routeName} method`
    }
  ),
  getFloors: trycatcher(
    async (
      where: IWhere,
      credentials: any = {}
    ): Promise<IGetFloorsResponse> => {
      const Floors: IFloor[] = utils.mapElementsToJSON(
        await server.Floor.findAll({
          where,
          attributes: FloorAttrFind.default,
          order: [["FloorID", "ASC"]],
          // @ts-ignore
          accContext: credentials
        })
      );
      const CalculatedFloors = await Promise.all(
        Floors.map(
          async (
            Floor
          ): Promise<
            IFloorSpacesSystemsComponentsPercents & IDeviationValues
          > => {
            const where = { FloorGUID: Floor.GUID };
            // TODO: remove as
            const Components: IGetComponentsResponse = (await methods.getComponents(
              where
            )) as IGetComponentsResponse;
            // TODO: remove as
            const Systems: IGetSystemsResponse = (await methods.getSystems(
              where
            )) as IGetSystemsResponse;
            // TODO: remove as
            const Spaces: IGetSpacesResponse = (await methods.getSpaces(
              where
            )) as IGetSpacesResponse;

            const FloorPercent = methods.averagePercent([
              Components.averagePercent,
              ...methods.getValues(Systems.Systems, PercentFlds.System),
              ...methods.getValues(Spaces.Spaces, PercentFlds.Space)
            ]);

            const Status = methods.statusRaiseUp(
              methods.averageStatus([
                Components.averageStatus,
                ...methods.getValues(Systems.Systems, StatusFld),
                ...methods.getValues(Spaces.Spaces, StatusFld)
              ]),
              FloorPercent,
              Floor.finishedAt
            );

            if (Floor.Status !== Status) {
              Floor.Status = Status;
              await server.Floor.update(
                {
                  Status
                },
                {
                  where: {
                    GUID: Floor.GUID
                  }
                }
              );
            }

            const deviations = methods.calcDeviations(
              Floor.startedAt,
              Floor.finishedAt,
              FloorPercent
            );

            return {
              ...Floor,
              Components: Components.Components,
              Systems: Systems.Systems,
              Spaces: Spaces.Spaces,
              FloorPercent,
              ...deviations
            };
          }
        )
      );
      return {
        Floors: CalculatedFloors,
        averageStatus: methods.averageStatus(
          CalculatedFloors.map(f => f.Status)
        ),
        averagePercent: methods.averagePercent(
          CalculatedFloors.map(f => f.FloorPercent)
        )
      };
    }
  ),
  getSpaces: trycatcher(
    async (
      where: IWhere,
      credentials: any = {}
    ): Promise<IGetSpacesResponse> => {
      const Spaces: ISpace[] = utils.mapElementsToJSON(
        await server.Space.findAll({
          where,
          attributes: SpaceAttrFind.default,
          order: [["SpaceID", "ASC"]],
          // @ts-ignore
          accContext: credentials,
          // @ts-ignore
          secDisable: true
        })
      );
      const CalculatedSpaces = await Promise.all(
        Spaces.map(
          async (
            Space
          ): Promise<ISpaceSystemsComponentsPercents & IDeviationValues> => {
            const where: IWhere = { SpaceGUID: Space.GUID };
            // TODO: remove as
            const Components: IGetComponentsResponse = (await methods.getComponents(
              where
            )) as IGetComponentsResponse;

            // TODO: remove as
            const Systems: IGetSystemsResponse = (await methods.getSystems(
              where
            )) as IGetSystemsResponse;

            const SpacePercent = methods.averagePercent([
              Components.averagePercent,
              ...methods.getValues(Systems.Systems, PercentFlds.System)
            ]);

            const Status = methods.statusRaiseUp(
              methods.averageStatus([
                Components.averageStatus,
                ...methods.getValues(Systems.Systems, StatusFld)
              ]),
              SpacePercent,
              Space.finishedAt
            );

            if (Space.Status !== Status) {
              Space.Status = Status;
              await server.Space.update(
                {
                  Status
                },
                {
                  where: {
                    GUID: Space.GUID
                  }
                }
              );
            }

            const deviations = methods.calcDeviations(
              Space.startedAt,
              Space.finishedAt,
              SpacePercent
            );

            return {
              ...Space,
              Components: Components.Components,
              Systems: Systems.Systems,
              SpacePercent,
              ...deviations
            };
          }
        )
      );

      return {
        Spaces: CalculatedSpaces,
        averageStatus: methods.averageStatus(
          CalculatedSpaces.map(s => s.Status)
        ),
        averagePercent: methods.averagePercent(
          CalculatedSpaces.map(s => s.SpacePercent)
        )
      };
    }
  ),
  getSystems: trycatcher(
    async (
      where: IWhere,
      credentials: any = {},
      isSecDisable: boolean = true
    ): Promise<IGetSystemsResponse> => {
      const Systems: ISystem[] = utils.mapElementsToJSON(
        await server.System.findAll({
          where,
          order: [["SystemID", "ASC"]],
          // @ts-ignore
          accContext: credentials,
          // @ts-ignore
          secDisable: isSecDisable
        })
      );

      const CalculatedSystems = await Promise.all(
        Systems.map(
          async (System): Promise<ISystemComponentsPercents> => {
            // TODO: remove as
            const Components: IGetComponentsResponse = (await methods.getComponents(
              {
                SystemGUID: System.GUID
              }
            )) as IGetComponentsResponse;

            if (System.Status !== Components.averageStatus) {
              System.Status = Components.averageStatus;
              await server.System.update(
                {
                  Status: System.Status
                },
                {
                  where: {
                    GUID: System.GUID
                  }
                }
              );
            }

            return {
              ...System,
              Components: Components.Components,
              SystemPercent: Components.averagePercent,
              Status: Components.averageStatus
            };
          }
        )
      );
      return {
        Systems: CalculatedSystems,
        averageStatus: methods.averageStatus(
          CalculatedSystems.map(s => s.Status)
        ),
        averagePercent: methods.averagePercent(
          CalculatedSystems.map(s => s.SystemPercent)
        )
      };
    },
    { logMessage: "planfact getSystems method" }
  ),
  getComponents: trycatcher(
    async (
      where: IWhere,
      credentials: any = {},
      isSecDisable: boolean = true
    ): Promise<IGetComponentsResponse> => {
      const Components = utils.mapElementsToJSON(
        await server.Component.findAll({
          where,
          order: [["ComponentID", "ASC"]],
          include: [
            {
              model: server.Fact,
              attributes: FactAttrFind.default
            },
            {
              model: server.Plan,
              attributes: PlanAttrFind.default
            },
            {
              model: server.Register,
              include: [
                {
                  model: server.Resource,
                  include: [
                    {
                      model: server.Measure
                    }
                  ]
                }
              ]
            }
          ],
          // @ts-ignore
          accContext: credentials,
          // @ts-ignore
          secDisable: isSecDisable
        })
      ) as IComponentPlanFact[];
      const CalculatedComponents = await Promise.all(
        Components.map(
          async (
            Component
          ): Promise<
            IComponentPlanFactPercents &
              IDeviationValues & { planOnDate: number | null }
          > => {
            const JobPlans = Component.Plans.filter(r => !r.isResource);
            // Расчет план факта для нескольких работ (не используется)
            const ComponentPlanFact: IComponentPlanFactNew[] = JobPlans.map(
              Plan => {
                const Facts = Component.Facts.filter(
                  Fact => Fact.JobGUID === Plan.JobGUID
                );

                const sumFact =
                  Component.Facts.length > 0 ? methods.sumFact(Facts) : null;

                return {
                  Plan,
                  Facts,
                  FactValue: sumFact,
                  JobAveragePercent: Plan.value
                    ? methods.calcPercents(Plan.value, sumFact || 0)
                    : null
                };
              }
            );
            // Расчет план факта для одной работы (используется)
            const PlanValue =
              JobPlans && JobPlans.length > 0 ? JobPlans[0].value : null;

            let planOnDate = methods.calcPlanOnDate(
              Component.startedAt,
              Component.finishedAt,
              PlanValue
            );

            const FactValue =
              Component.Facts.length > 0
                ? methods.sumFact(Component.Facts)
                : null;

            const ComponentPercent = PlanValue
              ? methods.calcPercents(PlanValue, FactValue || 0)
              : null;

            if (
              (ComponentPercent && ComponentPercent >= 100) ||
              new Date() >= Component.finishedAt
            ) {
              planOnDate = PlanValue;
            }

            const ComponentPercentOnDate = planOnDate
              ? methods.calcPercents(planOnDate, FactValue || 0)
              : null;

            const deviations = methods.calcDeviations(
              Component.startedAt,
              Component.finishedAt,
              ComponentPercentOnDate,
              {
                FactValue,
                planOnDate,
                totalPlan: PlanValue
              }
            );

            let Status = 0;

            if (planOnDate !== null) {
              const comparePlanFact = (FactValue || 0) < planOnDate;
              if (deviations.deviationPercents !== null) {
                if (new Date() > Component.finishedAt) {
                  Status = 1;
                } else if (comparePlanFact) {
                  Status = 2;
                } else {
                  Status = 4;
                }
              } else {
                if (FactValue !== null && FactValue !== 0) {
                  if (comparePlanFact) {
                    Status = 3;
                  } else {
                    if (FactValue !== 0 && new Date() <= Component.startedAt) {
                      Status = 3;
                    } else {
                      Status = 4;
                    }
                  }
                }
              }
            }

            // if (FactValue !== null) {
            //   if (
            //     PlanValue !== null &&
            //     (Component.finishedAt >= new Date() || FactValue >= PlanValue)
            //   ) {
            //     Status = 2;
            //   } else if (Component.finishedAt < new Date()) {
            //     Status = 1;
            //   }
            // }

            if (Component.Status !== Status) {
              Component.Status = Status;
              await server.Component.update(
                {
                  Status
                },
                {
                  where: {
                    GUID: Component.GUID
                  }
                }
              );
            }

            return {
              ...Component,
              ComponentPlanFact,
              PlanValue,
              FactValue,
              ComponentPercent,
              planOnDate,
              ...deviations
            };
          }
        )
      );

      const averageStatus = methods.averageStatus(
        CalculatedComponents.map(r => r.Status)
      );

      const averagePercent = methods.averagePercent(
        CalculatedComponents.map(c => c.ComponentPercent)
      );

      return {
        averagePercent,
        averageStatus,
        Components: CalculatedComponents
      };
    },
    {
      logMessage: "planfact getComponents method"
    }
  ),

  sumFact: (Facts: IFact[]): number => {
    let sum = 0;
    for (const Fact of Facts) {
      sum += +Fact.value;
    }
    return sum;
  },
  calcPercents: (plan: number, fact: number): number => {
    return (fact / plan) * 100;
  },
  averagePercent: (values: Array<number | null>): number | null => {
    let sum = 0;
    let count = 0;
    for (const value of values) {
      if (value === null) {
        continue;
      }
      sum += +value;
      count++;
    }
    if (count === 0) {
      return null;
    } else {
      return ((sum / count) * 100) / 100;
    }
  },
  getValues: (rows: any[], FldName: string): Array<number | null> => {
    return rows && rows.length !== 0 ? rows.map(r => r[FldName]) : [null];
  },
  averageStatus: (rows: Array<number | null | undefined>): number | null => {
    const filteredRows = rows.filter(
      r => r !== null && r !== undefined
    ) as number[];
    if (filteredRows.length === 0) {
      return null;
    }
    const isRed = !!rows.find(r => r === 1);

    const isYellow = !!rows.find(r => r === 2);

    const Status: number | null = Math.max(...filteredRows);

    if (!isRed) {
      return isYellow ? 2 : Status;
    }
    return 1;
  },
  calcDeviations(
    startedAt: Date,
    finishedAt: Date,
    factPercent: number | null,
    Component: {
      totalPlan: number | null;
      FactValue: number | null;
      planOnDate: number | null;
    } = {
      FactValue: null,
      planOnDate: null,
      totalPlan: null
    }
  ): IDeviationValues {
    const nullDeviation: IDeviationValues = {
      deviationDays: null,
      deviationPercents: null
    };

    const currentDate = new Date();

    if (
      startedAt > currentDate ||
      factPercent === null ||
      !startedAt ||
      !finishedAt
    ) {
      return nullDeviation;
    }

    const endDate = finishedAt >= currentDate ? currentDate : finishedAt;

    const rangeDays = methods.getDateRange(startedAt, endDate);

    const totalDays = methods.getDateRange(startedAt, finishedAt) + 1;

    // const planablePercentOnDate = (rangeDays / totalDays) * 100;

    const planablePercentOnDate = 100;

    if (factPercent >= planablePercentOnDate) {
      return nullDeviation;
    }
    let deviationDays = 0;
    if (Component.planOnDate !== null && Component.totalPlan !== null) {
      const planPerDay = utils.gaussRound(Component.totalPlan / totalDays, 2);
      console.log({ planPerDay });
      console.log({ pmf: Component.planOnDate - (Component.FactValue || 0) });

      deviationDays = utils.gaussRound(
        (Component.planOnDate - (Component.FactValue || 0)) / planPerDay,
        1
      );
    } else {
      deviationDays = utils.gaussRound(
        rangeDays - rangeDays * (factPercent / 100),
        1
      );
    }

    return {
      deviationPercents: planablePercentOnDate - factPercent,
      deviationDays
    };
  },
  getDateRange: (start: Date, end: Date): number => {
    const timeToDayK = 1000 * 60 * 60 * 24;
    return utils.gaussRound(
      end.getTime() / timeToDayK - start.getTime() / timeToDayK
    );
  },
  calcPlanOnDate: (
    startedAt: Date,
    finishedAt: Date,
    totalPlan: number | null
  ): number | null => {
    if (totalPlan !== null) {
      const currentDate = new Date();
      const endDate = finishedAt > currentDate ? currentDate : finishedAt;
      const rangeDays = methods.getDateRange(startedAt, endDate);
      const totalDays = methods.getDateRange(startedAt, finishedAt) + 1;

      const planPerDay = utils.gaussRound(totalPlan / totalDays, 2);

      // const planOnDate = (rangeDays / totalDays) * totalPlan;

      const planOnDate = rangeDays * planPerDay;

      return planOnDate < 0 ? 0 : planOnDate;
    }
    return totalPlan;
  },
  statusRaiseUp: (
    Status: number | null,
    percent: number | null,
    finishedAt: Date
  ): number | null => {
    if (Status !== null && Status > 2) {
      if (percent !== null && percent >= 100) {
        return 4;
      } else if (percent !== null) {
        return 3;
      }
    }

    if (new Date() > finishedAt) {
      return 1;
    }

    return Status;
  }
};

interface IWhere {
  [key: string]: string;
}

interface IDeviationValues {
  deviationPercents: number | null;
  deviationDays: number | null;
}

interface IComponentsDeviationValues {
  ComponentsDeviationPercents: number | null;
  ComponentsDeviationDays: number | null;
}

interface IAverage {
  averagePercent: number | null;
  averageStatus: number | null;
}

interface IGetComponentsResponse extends IAverage {
  Components: IComponentPlanFactPercents[];
}

interface IGetSystemsResponse extends IAverage {
  Systems: ISystemComponentsPercents[];
}

interface IGetFloorsResponse extends IAverage {
  Floors: IFloorSpacesSystemsComponentsPercents[];
}

interface IGetSpacesResponse extends IAverage {
  Spaces: ISpaceSystemsComponentsPercents[];
}

enum PercentFlds {
  System = "SystemPercent",
  Floor = "FloorPercent",
  Space = "SpacePercent",
  Component = "ComponentPercent"
}

const StatusFld = "Status";

export default methods;
