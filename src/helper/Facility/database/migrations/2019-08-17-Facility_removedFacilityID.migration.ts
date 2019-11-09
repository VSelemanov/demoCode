import { DataTypes, QueryInterface } from "sequelize";

const codeColumn = "FacilityID";
const tableName = "Facilities";
export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    const Schema = await migration.describeTable(tableName);
    if (Object.keys(Schema).includes(codeColumn)) {
      return await migration.removeColumn(
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
      type: DataTypes.INTEGER,
      allowNull: false
    });
  }
};
