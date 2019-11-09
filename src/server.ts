import Boom from "boom";
import { ISystemError } from "general/interfaces";
import Handlebars from "handlebars";
import * as Hapi from "hapi";
import * as AuthBearer from "hapi-auth-bearer-token";
import HapiSwagger from "hapi-swagger";
import Inert from "inert";
import SwiftClient from "openstack-swift-client";
import Sequelize from "sequelize";
import Vision from "vision";
import { CDNURI, mainURI } from "./constants";
// db
import db from "./database";
import dbConnect from "./database/connect";
import {
  IComponent,
  IComponentBase,
  IComponentInstance
} from "./helper/Component/interfaces";
import {
  IContact,
  IContactBase,
  IContactInstance
} from "./helper/Contact/interfaces";
import {
  IFacility,
  IFacilityBase,
  IFacilityInstance,
  IFacilityPhotoItemInstance,
  IFacilityPhotoItem,
  IFacilityPhotoItemBase
} from "./helper/Facility/interfaces";
import {
  IFact,
  IFactBase,
  IFactInstance,
  IPhotoFact,
  IPhotoFactBase,
  IPhotoFactInstance
} from "./helper/Fact/interfaces";
import { IFloor, IFloorBase, IFloorInstance } from "./helper/Floor/interfaces";
import { IJob, IJobBase, IJobInstance } from "./helper/Job/interfaces";
import {
  IMeasure,
  IMeasureBase,
  IMeasureInstance
} from "./helper/Measure/interfaces";
import { IPlan, IPlanBase, IPlanInstance } from "./helper/Plan/interfaces";
// interfaces
import {
  IProject,
  IProjectBase,
  IProjectInstance
} from "./helper/Project/interfaces";
import {
  IRegister,
  IRegisterBase,
  IRegisterInstance
} from "./helper/Register/interfaces";
import {
  IReport,
  IReportBase,
  IReportFile,
  IReportFileBase,
  IReportFileInstance,
  IReportInstance,
  IReportItem,
  IReportItemBase,
  IReportItemInstance,
  IReportType,
  IReportTypeBase,
  IReportTypeInstance
} from "./helper/Report/interfaces";
import {
  IResource,
  IResourceBase,
  IResourceInstance
} from "./helper/Resource/interfaces";
import { ISpace, ISpaceBase, ISpaceInstance } from "./helper/Space/interfaces";
import {
  ISystem,
  ISystemBase,
  ISystemInstance
} from "./helper/System/interfaces";
import { IUserBase, IUserInstance } from "./helper/User/interfaces";
// routes
import Routes from "./routes/index";
// strategies
import Auth from "./strategies/Auth";
// utils
import logger from "./utils/logger";
import { createPlugin as PromsterPlugin } from "@promster/hapi";

import migrations from "./umzug";

class Server {
  private _httpServerPort: number;
  private _dbConnect: Sequelize.Sequelize;
  private swaggerOptions = {
    info: {
      title: "REST API ESB",
      version: process.env.VERSION || "v1"
    },

    jsonPath: `${mainURI}/swagger.json`,
    swaggerUIPath: `${mainURI}/swaggerui/`,
    documentationPath: `${mainURI}/documentation`,
    cors: true,
    grouping: "tags",
    tagsGroupingFilter: (tag: string) => tag !== "api"
  };

  private _User: Sequelize.Model<IUserInstance, IUserBase>;
  private _Project: Sequelize.Model<IProjectInstance, IProject, IProjectBase>;

  private _Contact: Sequelize.Model<IContactInstance, IContact, IContactBase>;

  private _Facility: Sequelize.Model<
    IFacilityInstance,
    IFacility,
    IFacilityBase
  >;
  private _FacilityPhotoItem: Sequelize.Model<
    IFacilityPhotoItemInstance,
    IFacilityPhotoItem,
    IFacilityPhotoItemBase
  >;

  private _Floor: Sequelize.Model<IFloorInstance, IFloor, IFloorBase>;

  private _Space: Sequelize.Model<ISpaceInstance, ISpace, ISpaceBase>;

  private _Component: Sequelize.Model<
    IComponentInstance,
    IComponent,
    IComponentBase
  >;

  private _Register: Sequelize.Model<
    IRegisterInstance,
    IRegister,
    IRegisterBase
  >;

  private _System: Sequelize.Model<ISystemInstance, ISystem, ISystemBase>;

  private _Resource: Sequelize.Model<
    IResourceInstance,
    IResource,
    IResourceBase
  >;

  private _Job: Sequelize.Model<IJobInstance, IJob, IJobBase>;

  private _Fact: Sequelize.Model<IFactInstance, IFact, IFactBase>;

  private _PhotoFact: Sequelize.Model<
    IPhotoFactInstance,
    IPhotoFact,
    IPhotoFactBase
  >;

  private _Plan: Sequelize.Model<IPlanInstance, IPlan, IPlanBase>;

  private _ReportType: Sequelize.Model<
    IReportTypeInstance,
    IReportType,
    IReportTypeBase
  >;

  private _Report: Sequelize.Model<IReportInstance, IReport, IReportBase>;

  private _ReportFile: Sequelize.Model<
    IReportFileInstance,
    IReportFile,
    IReportFileBase
  >;

  private _ReportItem: Sequelize.Model<
    IReportItemInstance,
    IReportItem,
    IReportItemBase
  >;

  private _Measure: Sequelize.Model<IMeasureInstance, IMeasure, IMeasureBase>;

  private _SwiftClient;

  public _server: Hapi.Server;

  constructor(props: { port: number; dbConnect: Sequelize.Sequelize }) {
    this._httpServerPort = props.port;
    this._dbConnect = props.dbConnect;
  }

  public async createServer() {
    try {
      process.on("unhandledRejection", error => {
        // console.log({ error });
        logger.fatal(`unhandledRejection -->  ${error}`);
        process.exit(1);
      });

      this._server = new Hapi.Server({
        port: this._httpServerPort,
        routes: {
          cors: true
        }
      });

      await this._server.register([
        AuthBearer,
        Vision,
        Inert,
        {
          plugin: HapiSwagger,
          options: this.swaggerOptions
        },
        PromsterPlugin({})
      ]);

      (<any>this._server).views({
        engines: { html: Handlebars },
        path: `${__dirname}`,
        allowInsecureAccess: true,
        allowAbsolutePaths: true
      });

      this._server.auth.strategy("app-auth", "bearer-access-token", {
        validate: Auth.AppAuth
      });

      this._server.auth.strategy("user-auth", "bearer-access-token", {
        validate: Auth.UserAuth
      });

      this._server.auth.strategy("user-auth-jwt", "bearer-access-token", {
        validate: Auth.UserJWTAuth
      });

      this._server.auth.strategy("admin-auth-jwt", "bearer-access-token", {
        validate: Auth.AdminJWTAuth
      });

      this._server.auth.default("user-auth-jwt");

      this._server.route(Routes);
    } catch (error) {
      logger.error(`Create server --> ${error}`);
    }
  }

  protected async _Migrations() {
    await migrations.execute();
  }

  private async connectToDb() {
    try {
      await this._dbConnect.authenticate();
      logger.info("Success authenticate to DB");
      await this.defineAndsyncModel(this._dbConnect);
      logger.info("Success connect to DB");
      // migrations
      // await this._Migrations();
    } catch (error) {
      // console.log({ error });
      logger.fatal(`Error connect to DB --> ${error}`);
      process.exit(1);
    }
  }

  private async dbStop() {
    try {
      await this._dbConnect.close();
    } catch (error) {
      logger.fatal("DB Stop error", error);
    }
  }

  public createSwiftClient() {
    const auth = new SwiftClient.SwiftAuthenticator(
      CDNURI,
      process.env.SWIFT_CLIENT_USER || "",
      process.env.SWIFT_CLIENT_PASSWORD || ""
    );

    return new SwiftClient(auth);

    // this._SwiftClient = new SwiftClient(auth);
  }

  private async defineAndsyncModel(connect: Sequelize.Sequelize) {
    const response = db(connect);

    this._User = response.User;

    this._ReportType = response.ReportType;
    this._Report = response.Report;
    this._ReportItem = response.ReportItem;
    this._ReportFile = response.ReportFile;

    this._Project = response.Project;
    this._Contact = response.Contact;
    this._Facility = response.Facility;
    this._FacilityPhotoItem = response.FacilityPhotoItem;
    this._Floor = response.Floor;
    this._Space = response.Space;
    this._Component = response.Component;
    this._Register = response.Register;
    this._System = response.System;
    this._Resource = response.Resource;
    this._Job = response.Job;
    this._Fact = response.Fact;
    this._PhotoFact = response.PhotoFact;
    this._Plan = response.Plan;
    this._Measure = response.Measure;

    await this._dbConnect.sync({
      // force: true
    });
    return;
  }

  public generateHttpError(data: ISystemError) {
    const { code, message } = data;
    switch (code) {
      case 11000:
      case 400:
        return Boom.badRequest(message);
      case 404:
        return Boom.notFound(message);
      case 403:
        return Boom.forbidden(message);
      case 401:
        return Boom.unauthorized(message);
      default:
        logger.error(data);
        return Boom.badImplementation();
    }
  }

  public async startServer() {
    await this._server.start();
    logger.info("Server running on: ", this._server.info.uri);
  }

  public async start() {
    await this.createServer();
    await this.startServer();
    await this.connectToDb();
    // this.createSwiftClient();
  }

  private async serverStop() {
    await this._server.stop();
  }

  public async stop() {
    await this.serverStop();
    await this.dbStop();
  }

  public async reload() {
    await this.stop();
    await this.start();
  }
  get SwiftClient() {
    return this._SwiftClient;
  }
  get server() {
    return this._server;
  }
  get User() {
    return this._User;
  }

  get Report() {
    return this._Report;
  }
  get ReportType() {
    return this._ReportType;
  }
  get ReportItem() {
    return this._ReportItem;
  }
  get ReportFile() {
    return this._ReportFile;
  }

  get Project() {
    return this._Project;
  }
  get Contact() {
    return this._Contact;
  }
  get Facility() {
    return this._Facility;
  }
  get FacilityPhotoItem() {
    return this._FacilityPhotoItem;
  }
  get Floor() {
    return this._Floor;
  }
  get Space() {
    return this._Space;
  }
  get Component() {
    return this._Component;
  }
  get Register() {
    return this._Register;
  }
  get System() {
    return this._System;
  }
  get Resource() {
    return this._Resource;
  }
  get Job() {
    return this._Job;
  }
  get Fact() {
    return this._Fact;
  }
  get PhotoFact() {
    return this._PhotoFact;
  }
  get Plan() {
    return this._Plan;
  }
  get Measure() {
    return this._Measure;
  }
  get dbConnect() {
    return this._dbConnect;
  }
}

export const server = new Server({
  port: parseInt(process.env.PORT || "3000", 10),
  dbConnect
});
