import { DataTypes, QueryInterface } from "sequelize";
import { server } from "modules/esb/app/src/server";
const codeColumn = "ClassificationCode";
const tableName = "Jobs";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (!Object.keys(Schema).includes(codeColumn)) {
      return migration
        .addColumn(
          {
            tableName
          },
          codeColumn,
          {
            type: DataTypes.STRING
          }
        )
        .then(() => {
          server.Resource.update({ [codeColumn]: "" }, { where: {} }).then(
            async () => {
              await migration.changeColumn({ tableName }, codeColumn, {
                allowNull: false,
                type: DataTypes.STRING
              });
            }
          );
        });
    }
    return true;
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    return await migration.removeColumn("Jobs", codeColumn);
  }
};
