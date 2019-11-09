import { DataTypes, QueryInterface } from "sequelize";

const tableName = "Components";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (!Object.keys(Schema).includes("startedAt")) {
      return Promise.all([
        migration.addColumn(
          {
            tableName
          },
          "startedAt",
          {
            type: DataTypes.DATE
          }
        ),
        migration.addColumn(
          {
            tableName
          },
          "finishedAt",
          {
            type: DataTypes.DATE
          }
        )
      ]);
    }
    return true;
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    // return await migration.removeColumn(tableName, codeColumn);
  }
};
