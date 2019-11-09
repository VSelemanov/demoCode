import uuid = require("uuid");
import xlsx from "xlsx";
// import Sxlsx from "xlsx-style";

import ContactCtrl from "../Contact";
import FacilityCtrl from "../Facility";
import FloorCtrl from "../Floor";
import SpaceCtrl from "../Space";
import SystemCtrl from "../System";
import RegisterCtrl from "../Register";
import ComponentCtrl from "../Component";
import ResourceCtrl from "../Resource";
import PlanCtrl from "../Plan";
import PlanFactMethods from "../PlanFact";

import { IFacilityBase, IFacility } from "../Facility/interfaces";
import { IFloorBase } from "../Floor/interfaces";
import { ISpaceBase } from "../Space/interfaces";
import { IRegisterBase } from "../Register/interfaces";
import { IContactBase } from "../Contact/interfaces";
import { IComponentBase } from "../Component/interfaces";
import { ISystemBase } from "../System/interfaces";
import { IResourceForCIMS } from "../Resource/interfaces";
import trycatcher from "../../utils/trycatcher";
import {
  CIMSSheets,
  CIMSTemplateFilename,
  ResourceSheetFilename
} from "./constants";
import {
  IContactCIMSFlds,
  IFacilityCIMSFlds,
  IFloorCIMSFlds,
  ISpaceCIMSFlds,
  ISystemCIMSFlds,
  IRegisterCIMSFlds,
  IComponentCIMSFlds
} from "./interfaces";
import { server } from "../../server";
import utils from "../../utils";
import { ResourceCIMSSheetName, attrFind } from "../Resource/constants";
import fs from "fs";
import { IPlanBase } from "../Plan/interfaces";
import { IFactBase } from "../Fact/interfaces";

import PlanMethods from "../Plan";
import FactMethods from "../Fact";
import sequelize from "../../database/connect";
import SystemError from "general/SystemError";
import { ErrorCode } from "general/constants";
import CIMSParser from "./lib/parser";
import { parse } from "querystring";

const methods = {
  CIMSParse2: trycatcher(
    async (xlsFile: xlsx.WorkBook, ProjectGUID: string) => {
      const parsed = CIMSParser(xlsFile);
      // console.log("parsed", JSON.stringify(parsed, null, 2));

      // @ts-ignore
      const facility = await FacilityCtrl.createFormData(
        {
          FacilityName: "Многоквартирный жилой дом",
          ProjectGUID
        },
        []
      );
      const facilityGUID = facility[0].GUID;

      for (const floorData of parsed.floors) {
        const floor = {
          GUID: floorData.guid,
          FacilityGUID: facilityGUID,
          FloorID: floorData.floorID,
          FloorName: floorData.name,
          FloorReferenceID: "test",
          ExternalSystemName: "",
          ExternalNameID: "",
          CreatedBy: uuid.v4(),
          Withdrawn: "false",
          startedAt: new Date(),
          finishedAt: new Date()
        };

        await FloorCtrl.create([floor]);
      }

      for (const registerData of parsed.registers) {
        const resource = await server.Resource.findOne({
          where: {
            ResourceName: registerData.resourceName
          }
        });

        const resourceGUID = resource
          ? resource.GUID
          : "a4162c7e-fb10-4600-9291-24e26eb7e0a9";

        await RegisterCtrl.create([
          {
            FacilityGUID: facilityGUID,
            ProductType: registerData.resourceName,
            RegisterType: registerData.resourceName,
            AssetType: registerData.resourceName,
            RegisterApprovalBy: registerData.resourceName,
            RegisterID: registerData.registerID,
            RegisterName: registerData.name,
            RegisterReference: registerData.name,
            GUID: registerData.guid,

            ResourceGUID: resourceGUID
          }
        ]);
      }

      const Jobs = await server.Job.findAll();

      for (const step of parsed.steps) {
        for (const component of step.components) {
          const register = getEntityObject(
            parsed.registers,
            "registerID",
            "name",
            component.registerName
          );

          for (const floor of component.floors) {
            const floorObject = getEntityObject(
              parsed.floors,
              "floorID",
              "name",
              floor.name
            );

            const ComponentGUID = uuid.v4();
            await ComponentCtrl.create([
              {
                GUID: ComponentGUID,
                ComponentID: component.componentID,
                ComponentName: component.componentName,
                Count: 0,
                ExternalNameID: "",
                ExternalSystemName: "",
                RegisterGUID: register ? register.guid : null,
                FloorGUID: floorObject ? floorObject.guid : null
              }
            ]);

            if (floor.value > 0) {
              const job = Jobs.find(r => component.jobName === r.JobName) || {
                GUID: Jobs[0].GUID
              };
              await PlanCtrl.create([
                {
                  ComponentGUID,
                  JobGUID: job.GUID,
                  isResource: false,
                  value: floor.value
                }
              ] as IPlanBase[]);
            }
          }
        }
      }

      return "ok";
    },
    { logMessage: "Parse cims v2" }
  ),
  CIMSParse: trycatcher(
    async (
      xlsFile: xlsx.WorkBook,
      ProjectGUID: string,
      credentials: any = {}
    ) => {
      return sequelize.transaction(async t => {
        try {
          let ContactsMap: Map<string, string> = new Map();
          let FacilitiesMap: Map<string, string> = new Map();
          let FloorsMap: Map<string, string> = new Map();
          let SpacesMap: Map<string, string> = new Map();
          let RegistersMap: Map<string, string> = new Map();
          let SystemsMap: Map<string, string> = new Map();

          const Plans: IPlanBase[] = [];
          const Facts: IFactBase[] = [];

          const Resources = utils.mapElementsToJSON(
            await server.Resource.findAll()
          );

          const ResourcesMap: Map<string, string> = new Map(Resources.map((r): [
            string,
            string
          ] => [
            `${r.ClassificationCode},${r.ResourceName}`,
            r.GUID
          ]) as ReadonlyArray<[string, string]>);

          for (const sheetNameKey of Object.keys(CIMSSheets)) {
            const sheetName = CIMSSheets[sheetNameKey];
            const sheetRows: any[] = xlsx.utils.sheet_to_json(
              xlsFile.Sheets[sheetName],
              {
                defval: null
              }
            );

            if (
              sheetName !== CIMSSheets.Contact &&
              sheetName !== CIMSSheets.Facility
            ) {
              methods.createLinksToParentEntity(
                sheetRows,
                ContactsMap,
                "",
                "",
                "CreatedBy",
                "CreatedBy"
              );
            }
            switch (sheetName) {
              case CIMSSheets.Contact:
                // генерим мапу контактов
                ContactsMap = methods.createLinksToParentEntity<
                  Array<IContactBase & IContactCIMSFlds>
                >(
                  sheetRows,
                  ContactsMap,
                  "GUID",
                  "ContactIDPick",
                  "CreatedBy",
                  "ContactIDPick"
                );
                // применяем мапу контактов к контактам
                methods.createLinksToParentEntity<
                  Array<IContactBase & IContactCIMSFlds>
                >(
                  sheetRows,
                  ContactsMap,
                  "",
                  "ContactIDPick",
                  "CreatedBy",
                  "ContactIDPick"
                );

                await ContactCtrl.create(sheetRows);
                break;
              case CIMSSheets.Facility:
                // TODO: Продумать реализацию связей с контактом
                for (const facility of sheetRows as Array<
                  IFacilityBase & IFacilityCIMSFlds
                >) {
                  facility.ProjectGUID = ProjectGUID;
                }

                FacilitiesMap = methods.createLinksToParentEntity<
                  Array<IContactBase & IContactCIMSFlds>
                >(
                  sheetRows,
                  ContactsMap,
                  "GUID",
                  "FacilityIDPick",
                  "CreatedBy",
                  "CreatedBy"
                );

                await FacilityCtrl.create(
                  sheetRows
                  // sheetRows.filter(
                  //   r => r.FacilityName && r.FacilityID && r.CreatedBy
                  // )
                );

                break;
              case CIMSSheets.Floor:
                // TODO: возможно необходимо сделать дополнительную защиту данных на получаемые поля из экселя
                FloorsMap = methods.createLinksToParentEntity<
                  Array<IFloorBase & IFloorCIMSFlds>
                >(
                  sheetRows,
                  FacilitiesMap,
                  "GUID",
                  "FloorIDPick",
                  "FacilityGUID",
                  "FacilityIDPick"
                );

                await FloorCtrl.create(sheetRows);
                break;
              case CIMSSheets.Space:
                SpacesMap = methods.createLinksToParentEntity<
                  Array<ISpaceBase & ISpaceCIMSFlds>
                >(
                  sheetRows,
                  FloorsMap,
                  "GUID",
                  "SpaceIDPick",
                  "FloorGUID",
                  "FloorIDPick"
                );

                await SpaceCtrl.create(sheetRows);
                break;
              case CIMSSheets.System:
                SystemsMap = methods.createLinksToParentEntity<
                  Array<ISystemBase & ISystemCIMSFlds>
                >(
                  sheetRows,
                  FacilitiesMap,
                  "GUID",
                  "SystemIDPick",
                  "FacilityGUID",
                  "FacilityIDPick"
                );

                methods.createLinksToParentEntity<
                  Array<ISystemBase & ISystemCIMSFlds>
                >(sheetRows, FloorsMap, "", "", "FloorGUID", "FloorIDPick");

                methods.createLinksToParentEntity<
                  Array<ISystemBase & ISystemCIMSFlds>
                >(sheetRows, SpacesMap, "", "", "SpaceGUID", "SpaceIDPick");

                await SystemCtrl.create(sheetRows);

                break;
              case CIMSSheets.Register:
                RegistersMap = methods.createLinksToParentEntity<
                  Array<IRegisterBase & IRegisterCIMSFlds>
                >(
                  sheetRows,
                  FacilitiesMap,
                  "GUID",
                  "RegisterIDPick",
                  "FacilityGUID",
                  "FacilityIDPick"
                );

                // console.log({ sheetRows });
                // console.log({ ResourcesMap });

                methods.createLinksToParentEntity<
                  Array<IRegisterBase & IRegisterCIMSFlds>
                >(
                  sheetRows,
                  ResourcesMap,
                  "",
                  "",
                  "ResourceGUID",
                  "ResourceIDPick"
                );

                const Registers = await RegisterCtrl.create(sheetRows);

                break;
              case CIMSSheets.Component:
                methods.createLinksToParentEntity<
                  Array<IComponentBase & IComponentCIMSFlds>
                >(
                  sheetRows,
                  RegistersMap,
                  "GUID",
                  "ComponentIDPick",
                  "RegisterGUID",
                  "RegisterIDPick"
                );

                methods.createLinksToParentEntity<
                  Array<IComponentBase & IComponentCIMSFlds>
                >(
                  sheetRows,
                  FacilitiesMap,
                  "",
                  "",
                  "FacilityGUID",
                  "FacilityIDPick"
                );

                methods.createLinksToParentEntity<
                  Array<IComponentBase & IComponentCIMSFlds>
                >(sheetRows, FloorsMap, "", "", "FloorGUID", "FloorIDPick");

                methods.createLinksToParentEntity<
                  Array<IComponentBase & IComponentCIMSFlds>
                >(sheetRows, SpacesMap, "", "", "SpaceGUID", "SpaceIDPick");

                methods.createLinksToParentEntity<
                  Array<IComponentBase & IComponentCIMSFlds>
                >(sheetRows, SystemsMap, "", "", "SystemGUID", "SystemIDPick");

                await ComponentCtrl.create(sheetRows);

                const Components = await server.Component.findAll({
                  include: [
                    {
                      model: server.Register,
                      include: [
                        {
                          model: server.Resource,
                          include: [
                            {
                              model: server.Job
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  // @ts-ignore
                  secDisable: true
                });

                for (const row of sheetRows as Array<
                  IComponentBase &
                    IComponentCIMSFlds & {
                      CountFact: number;
                      CountPlan: number;
                    }
                >) {
                  // @ts-ignore
                  const Job = Components.find(r => r.GUID === row.GUID).Register
                    .Resource.Jobs[0];

                  // row.Count = 1;
                  if (row.CountPlan && +row.CountPlan !== 0) {
                    Plans.push({
                      ComponentGUID: row.GUID,
                      isResource: false,
                      value: +row.CountPlan,
                      JobGUID: Job.GUID
                    });
                    if (row.CountFact && +row.CountFact !== 0) {
                      Facts.push({
                        ComponentGUID: row.GUID,
                        isResource: false,
                        JobGUID: Job.GUID,
                        value: +row.CountFact,
                        uploadedAt: new Date(),
                        UserGUID: credentials.id
                      });
                    }
                  }
                }
                if (Plans.length > 0) {
                  await PlanMethods.create(Plans);
                }
                if (Facts.length > 0) {
                  await FactMethods.create(Facts);
                }

                break;
            }
          }
        } catch (err) {
          // throw new SystemError({
          //   code: err._code,
          //   message: err._message
          // });
          throw err;
        }
      });
    },
    { logMessage: "Parse CIMS method" }
  ),
  createLinksToParentEntity: <T>(
    sheetRows: T[],
    map: Map<string, string>,
    guidFld: string,
    IDPickFld: string,
    parentGuidFld: string,
    parentIDPickFld: string
  ): Map<string, string> => {
    const newmap: Map<string, string> = new Map();
    for (const row of sheetRows) {
      // TODO: отловить записи, которые ссылаются на несуществующий Facility
      row[guidFld] = uuid.v4();
      row[parentGuidFld] = map.get(row[parentIDPickFld]) || null;
      newmap.set(row[IDPickFld], row[guidFld]);
    }
    return newmap;
  },
  updateCIMSTemplate: trycatcher(
    async () => {
      const Resources = utils.mapElementsToJSON(
        await server.Resource.findAll({ attributes: attrFind.default })
      );
      const ResourcesCIMS: IResourceForCIMS[] = Resources.map(
        (r): IResourceForCIMS => ({
          ClassificationID: r.ClassificationID,
          KSRGUID: r.KSRGUID,
          ResourceID: r.ResourceID,
          ResourceName: r.ResourceName,
          ResourceIDPick: `${r.ResourceID},${r.ResourceName}`,
          ClassificationCode: ""
        })
      );
      const TemplateFile = xlsx.readFile(
        `${__dirname}/${CIMSTemplateFilename}`,
        {
          type: "buffer"
        }
      );

      if (!TemplateFile.SheetNames.includes(ResourceCIMSSheetName)) {
        const sheet = xlsx.utils.json_to_sheet([{}]);
        xlsx.utils.book_append_sheet(
          TemplateFile,
          sheet,
          ResourceCIMSSheetName
        );
      }
      xlsx.utils.sheet_add_json(
        TemplateFile.Sheets[ResourceCIMSSheetName],
        ResourcesCIMS
      );
      xlsx.writeFile(TemplateFile, `${__dirname}/${CIMSTemplateFilename}`, {
        compression: true
      });
    },
    {
      logMessage: "Update cims template method"
    }
  ),
  updateResourceSheet: trycatcher(
    async () => {
      const Resources = utils.mapElementsToJSON(
        await server.Resource.findAll({ attributes: attrFind.default })
      );
      const ResourcesCIMS: IResourceForCIMS[] = Resources.map(
        (r): IResourceForCIMS => ({
          ClassificationID: r.ClassificationID,
          KSRGUID: r.KSRGUID,
          ResourceID: r.ResourceID,
          ResourceName: r.ResourceName,
          ResourceIDPick: `${r.ClassificationCode},${r.ResourceName}`,
          ClassificationCode: r.ClassificationCode
        })
      );
      const filePath = `${__dirname}/${ResourceSheetFilename}`;
      const TemplateFile = xlsx.readFile(filePath, {
        type: "buffer"
      });

      if (!TemplateFile.SheetNames.includes(ResourceCIMSSheetName)) {
        const sheet = xlsx.utils.json_to_sheet([{}]);
        xlsx.utils.book_append_sheet(
          TemplateFile,
          sheet,
          ResourceCIMSSheetName
        );
      }
      xlsx.utils.sheet_add_json(
        TemplateFile.Sheets[ResourceCIMSSheetName],
        ResourcesCIMS
      );
      xlsx.writeFile(TemplateFile, filePath, {
        compression: true
      });
    },
    {
      logMessage: "Update cims template method"
    }
  )
};

function getEntityObject(
  entityArr: any[],
  IDFld: string = "ID",
  nameFld: string = "name",
  componentEntityName: string = "name"
) {
  return entityArr.find(
    r => `${r[IDFld]}. ${r[nameFld]}` === componentEntityName
  );
}

export default methods;
