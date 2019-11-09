import * as Sequelize from "sequelize";
import { IResourceInstance, IResource, IResourceBase } from "../interfaces";
import ResourceSchema from "./models";
import { server } from "../../../server";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<
    IResourceInstance,
    IResource,
    IResourceBase
  >("Resource", ResourceSchema, {
    indexes: []
  });

  instance.beforeCreate(async (attrs, options) => {
    const ResourceID = await server.Resource.max("ResourceID");
    if (!ResourceID) {
      attrs.ResourceID = 1;
      return;
    }
    attrs.ResourceID = ResourceID + 1;
    return;
  });

  return instance;
};
