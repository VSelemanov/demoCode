import { DataTypes, QueryInterface } from "sequelize";
import { server } from "modules/esb/app/src/server";
const codeColumn = "Mark";
const tableName = "Facts";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (!Object.keys(Schema).includes(codeColumn)) {
      await migration.addColumn(
        {
          tableName
        },
        codeColumn,
        {
          type: DataTypes.STRING
        }
      );
    }
    return true;
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    return await migration.removeColumn(tableName, codeColumn);
  }
};
