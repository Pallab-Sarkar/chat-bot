import { Schema, model } from "mongoose";
import { AuditFieldSchema } from "./BaseModel.js";
import lodash from "lodash";
const { isNil } = lodash;

const schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
  },
  license_key: {
    type: String,
  },
  auditFields: {
    type: AuditFieldSchema,
  },
});

schema.pre("save", function (next) {
  if (isNil(this.auditFields)) {
    this.auditFields = {};
  }
  this.auditFields.updatedAt = new Date();
  if (isNil(this.auditFields.createdAt)) {
    this.auditFields.createdAt = new Date();
  }
  if (isNil(this.auditFields.isActive)) {
    this.auditFields.isActive = true;
  }
  if (isNil(this.auditFields.isDeleted)) {
    this.auditFields.isDeleted = false;
  }
  next();
});

export default model("OrgModel", schema, "org");
