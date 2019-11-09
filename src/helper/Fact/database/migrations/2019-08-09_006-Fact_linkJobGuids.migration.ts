import { DataTypes, QueryInterface, Op } from "sequelize";
import { server } from "modules/esb/app/src/server";
import uuid = require("uuid");
import logger from "../../../../utils/logger";
const codeColumn = "JobGUID";
const tableName = "Facts";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    try {
      const Facts = await server.Fact.findAll({
        where: {
          JobGUID: null
        }
      });

      const ComponentGUIDs = Facts.map(r => r.ComponentGUID);

      const Components = await server.Component.findAll({
        where: {
          GUID: { [Op.in]: ComponentGUIDs }
        },
        include: [
          {
            model: server.Register,
            where: {
              ResourceGUID: {
                [Op.not]: null
              }
            },
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
        ]
      });

      for (const Fact of Facts) {
        for (const Component of Components) {
          if (
            Fact.ComponentGUID === Component.GUID &&
            // @ts-ignore
            Component.Register &&
            // @ts-ignore
            Component.Register.Resource &&
            // @ts-ignore
            Component.Register.Resource.Jobs &&
            // @ts-ignore
            Component.Register.Resource.Jobs[0]
          ) {
            await Fact.update({
              // @ts-ignore
              JobGUID: Component.Register.Resource.Jobs[0].GUID
            });
          }
        }
      }

      return true;
    } catch (error) {
      logger.error(`${error}`);
      return false;
    }
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    return await migration.removeColumn(tableName, codeColumn);
  }
};
