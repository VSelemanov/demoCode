import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (migration: QueryInterface, DataTypes: DataTypes) => {
    try {
      return await migration.removeConstraint(
        "Floors",
        "Floors_CreatedBy_fkey"
      );
    } catch (err) {
      return true;
    }
  },
  down: async (migration: QueryInterface, DataTypes: DataTypes) => {
    return true;
  }
};
