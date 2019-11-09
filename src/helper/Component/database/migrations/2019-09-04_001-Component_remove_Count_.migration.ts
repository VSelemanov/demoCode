import { DataTypes, QueryInterface } from "sequelize";

const codeColumn = "Count";
const tableName = "Components";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (Object.keys(Schema).includes(codeColumn)) {
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
      type: DataTypes.INTEGER
    });
  }
};
