import * as Sequelize from "sequelize";
import { IJobInstance, IJob, IJobBase } from "../interfaces";
import JobSchema from "./models";
import { server } from "../../../server";

export default (sequelize: Sequelize.Sequelize) => {
  const instance = sequelize.define<IJobInstance, IJob, IJobBase>(
    "Job",
    JobSchema,
    {
      indexes: []
    }
  );

  instance.beforeCreate(async (attrs, options) => {
    const JobID = await server.Job.max("JobID");
    if (!JobID) {
      attrs.JobID = 1;
      return;
    }
    attrs.JobID = JobID + 1;
    return;
  });

  return instance;
};
