import * as Sequelize from "sequelize";

import { Op } from "sequelize";

import seqAccess from "sequelize-access";

import userInstance from "../helper/User/database/instance";
import projectInstance from "../helper/Project/database/instance";
import contactInstance from "../helper/Contact/database/instance";
import facilityInstance from "../helper/Facility/database/instance";
import floorInstance from "../helper/Floor/database/instance";
import spaceInstance from "../helper/Space/database/instance";
import componentInstance from "../helper/Component/database/instance";
import registerInstance from "../helper/Register/database/instance";
import systemInstance from "../helper/System/database/instance";
import resourceInstance from "../helper/Resource/database/instance";
import jobInstance from "../helper/Job/database/instance";
import factInstance from "../helper/Fact/database/instance";
import { photoFactInstance } from "../helper/Fact/database/instance";
import { FacilityPhotoItemInstance } from "../helper/Facility/database/instance";
import planInstance from "../helper/Plan/database/instance";
import reportInstance, {
  reportItemInstance,
  reportTypeInstance,
  reportFileInstance
} from "../helper/Report/database/instance";
import measureInstance from "../helper/Measure/database/instance";

export default (sequelize: Sequelize.Sequelize) => {
  /* USER */
  const User = userInstance(sequelize);
  /* CONTACT */
  const Contact = contactInstance(sequelize);
  /* PROJECT */
  const Project = projectInstance(sequelize);
  /* FACILITY */
  const Facility = facilityInstance(sequelize);
  const FacilityPhotoItem = FacilityPhotoItemInstance(sequelize);
  /* FLOOR */
  const Floor = floorInstance(sequelize);
  /* SPACE */
  const Space = spaceInstance(sequelize);
  /* COMPONENT */
  const Component = componentInstance(sequelize);
  /* REGISTER */
  const Register = registerInstance(sequelize);
  /* SYSTEM */
  const System = systemInstance(sequelize);
  /* RESOURCE */
  const Resource = resourceInstance(sequelize);
  /* JOB */
  const Job = jobInstance(sequelize);
  /* FACT */
  const Fact = factInstance(sequelize);
  const PhotoFact = photoFactInstance(sequelize);
  /* PLAN */
  const Plan = planInstance(sequelize);
  /* REPORT */
  const Report = reportInstance(sequelize);
  const ReportItem = reportItemInstance(sequelize);
  const ReportFile = reportFileInstance(sequelize);
  const ReportType = reportTypeInstance(sequelize);
  /* MEASURE */
  const Measure = measureInstance(sequelize);

  // NEW LINKS BETWEEN ENTITIES
  Contact.hasMany(Contact, { foreignKey: "CreatedBy" });
  Contact.hasMany(Facility, { foreignKey: "CreatedBy" });
  // Contact.hasMany(Floor, { foreignKey: "CreatedBy" });
  Contact.hasMany(Space, { foreignKey: "CreatedBy" });
  Contact.hasMany(System, { foreignKey: "CreatedBy" });
  Contact.hasMany(Register, { foreignKey: "CreatedBy" });
  Contact.hasMany(Component, { foreignKey: "CreatedBy" });

  Project.hasMany(Facility, { foreignKey: "ProjectGUID" });

  Facility.belongsTo(Project, { foreignKey: "ProjectGUID" });
  Facility.hasMany(Floor, { foreignKey: "FacilityGUID" });
  Facility.hasMany(Component, { foreignKey: "FacilityGUID" });
  Facility.hasMany(System, { foreignKey: "FacilityGUID" });
  Facility.hasMany(Register, { foreignKey: "FacilityGUID" });
  Facility.hasMany(FacilityPhotoItem, { foreignKey: "FacilityGUID" });

  Floor.hasMany(Space, { foreignKey: "FloorGUID" });
  Floor.hasMany(Component, { foreignKey: "FloorGUID" });
  Floor.hasMany(System, { foreignKey: "FloorGUID" });
  Floor.belongsTo(Facility, { foreignKey: "FacilityGUID" });

  Space.hasMany(Component, { foreignKey: "SpaceGUID" });
  Space.hasMany(System, { foreignKey: "SpaceGUID" });
  Space.belongsTo(Floor, { foreignKey: "FloorGUID" });

  System.hasMany(Component, { foreignKey: "SystemGUID" });
  System.belongsTo(Facility, { foreignKey: "FacilityGUID" });

  Component.belongsTo(Register, { foreignKey: "RegisterGUID" });
  Component.belongsTo(Facility, { foreignKey: "FacilityGUID" });
  Component.belongsTo(Floor, { foreignKey: "FloorGUID" });
  Component.belongsTo(Space, { foreignKey: "SpaceGUID", targetKey: "GUID" });

  Component.hasMany(Fact, { foreignKey: "ComponentGUID" });

  Component.hasMany(Plan, { foreignKey: "ComponentGUID" });

  Plan.belongsTo(Job, { foreignKey: "JobGUID" });

  Register.belongsTo(Resource, { foreignKey: "ResourceGUID" });
  Register.belongsTo(Facility, { foreignKey: "FacilityGUID" });

  const ResourceJob = sequelize.define("resource_job", {});

  Resource.belongsToMany(Job, { through: ResourceJob });
  Resource.hasMany(Resource, { foreignKey: "ParentGUID" });
  Resource.belongsTo(Measure, { foreignKey: "MeasureGUID" });

  Job.belongsToMany(Resource, { through: ResourceJob });
  Job.hasMany(Job, { foreignKey: "ParentGUID" });
  Job.belongsTo(Measure, { foreignKey: "MeasureGUID" });

  Fact.hasMany(PhotoFact, { foreignKey: "FactGUID" });
  Fact.belongsTo(Component, { foreignKey: "ComponentGUID" });
  Fact.belongsTo(Job, { foreignKey: "JobGUID" });
  PhotoFact.belongsTo(Fact, { foreignKey: "FactGUID" });

  ReportType.hasMany(Report, { foreignKey: "ReportTypeGUID" });
  Report.hasMany(ReportFile, { foreignKey: "ReportGUID" });
  ReportFile.hasMany(ReportItem, { foreignKey: "ReportFileGUID" });

  if (process.env.APP_STATUS !== "dev") {
    const sa = new seqAccess(sequelize);
    sa.addFilter("Project", {
      GUID: {
        $in: ctx => (ctx ? ctx.projects.concat(ctx.userProjects) : [])
      }
    });
    sa.addFilter("Facility", {
      $or: [
        {
          GUID: {
            $in: ctx => (ctx ? ctx.facilities : [])
          }
        },
        {
          ProjectGUID: {
            $in: ctx => (ctx ? ctx.userProjects : [])
          }
        }
      ]
      // }
      // ]
    });
  }

  return {
    User,
    Project,

    Report,
    ReportType,
    ReportFile,
    ReportItem,

    Contact,
    Facility,
    FacilityPhotoItem,
    Floor,
    Space,
    Register,
    Component,
    System,
    Resource,
    Job,
    Fact,
    PhotoFact,
    Plan,
    Measure
  };
};
