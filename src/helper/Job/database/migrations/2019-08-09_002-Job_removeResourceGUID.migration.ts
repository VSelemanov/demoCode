import { DataTypes, QueryInterface } from "sequelize";
import { server } from "modules/esb/app/src/server";
import sequelize from "../../../../database/connect";
const codeColumn = "ResourceGUID";
const tableName = "Jobs";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (Object.keys(Schema).includes(codeColumn)) {
      const Resources = await server.Resource.findAll();
      const Jobs = (await sequelize.query(
        'SELECT * FROM public."Jobs"',
        {}
      ))[0];

      for (const Resource of Resources) {
        for (const Job of Jobs) {
          // @ts-ignore
          if (Job.ResourceGUID === Resource.GUID) {
            // @ts-ignore
            await Resource.addJob(Job.GUID);
          }
        }
      }

      return migration.removeColumn(
        {
          tableName
        },
        codeColumn
      );
    }
    return true;
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    return await migration.addColumn(tableName, codeColumn, {
      type: DataTypes.UUID
    });
  }
};
