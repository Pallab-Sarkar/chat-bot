import { constants } from "../config/constants.js";
import OrgModel from "../models/OrgModel.js";
import { prepareUserResponse as prepareUserRes1 } from "../utils/utils.js";

async function isAuthenticate(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res
        .status(constants.HTML_STATUS_CODE.UNAUTHORIZED)
        .json({ Message: "Access denied!" });
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    if (token == null) {
      return res
        .status(constants.HTML_STATUS_CODE.UNAUTHORIZED)
        .json({ Message: "Token not found in request" });
    }

    // check user data with database if user is valid or not...
    // We can use redis db to check the user data...
    let user;
    user = await OrgModel.findOne({ license_key: token });
    if (user == null) {
      return res
        .status(constants.HTML_STATUS_CODE.UNAUTHORIZED)
        .json({ Message: "Invalid Token" });
    }
    if (!user.auditFields.isActive) {
      return res
        .status(constants.HTML_STATUS_CODE.UNAUTHORIZED)
        .json({ Message: "User not active , please contact admin !!" });
    }
    if (user.auditFields.isDeleted) {
      return res
        .status(constants.HTML_STATUS_CODE.UNAUTHORIZED)
        .json({ Message: "User not active , please contact admin !!" });
    }
    // Add userDetail in req.user so that we can use user detail in future
    req.user = prepareUserRes1(user);
    next();
  } catch (error) {
    if (error.name && error.name.indexOf("TokenExpiredError") > -1) {
      return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json(error);
    } else {
      return res
        .status(error.status || constants.HTML_STATUS_CODE.INTERNAL_ERROR)
        .json(error);
    }
  }
}

export default isAuthenticate;
