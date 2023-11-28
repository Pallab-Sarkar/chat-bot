import { Schema } from "mongoose";

export const auditFields = {
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  ipAddress: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  isActive: {
    type: Boolean,
    require: true,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    require: true,
    default: false,
  },
  reasonForDelete: {
    type: String,
  },
  reasonForDeactivate: {
    type: String,
  },
};

export const AuditFieldSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      require: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      require: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  { _id: false }
);

export const SEOSchema = new Schema(
  {
    metaTitle: {
      type: String,
    },
    metaKeyword: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  { _id: false }
);

export const MediaSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});
