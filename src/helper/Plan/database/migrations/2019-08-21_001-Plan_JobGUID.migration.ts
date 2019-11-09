import { DataTypes, QueryInterface } from "sequelize";

const codeColumn = "JobGUID";
const tableName = "Plans";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (!Object.keys(Schema).includes(codeColumn)) {
      return migration.addColumn(
        {
          tableName
        },
        codeColumn,
        {
          type: DataTypes.UUID,
          allowNull: false
        }
      );
    }
    return true;
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    return await migration.removeColumn(tableName, codeColumn);
  }
};
