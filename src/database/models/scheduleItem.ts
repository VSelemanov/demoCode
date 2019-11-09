import * as Sequelize from "sequelize";

const schema = {
  id: {
    type: Sequelize.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  code: {
    type: Sequelize.STRING(9)
  },
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  parentId: {
    type: Sequelize.UUID,
    defaultValue: null
  },
  scheduleId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  elementId: {
    type: Sequelize.UUID
  },
  duration: {
    type: Sequelize["DOUBLE PRECISION"]
  },
  startedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  finishedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
};

export default schema;
