import lodash from "lodash";
const { orderBy } = lodash;

export function prepareUserResponse(user) {
  // if(user._doc){
  user._doc ? delete user._doc.otp : delete user.otp;
  user._doc ? delete user._doc.password : delete user.password;
  user._doc ? delete user._doc.token : delete user.token;
  user._doc ? delete user._doc.__v : delete user.__v;
  user._doc ? delete user._doc.otpValidity : delete user.otpValidity;

  return user._doc ? user._doc : user;
  // }
  // return user
}

export function handleError(res) {
  return (error) => {
    console.log(error);
    res.status(error.status || 400).json(error);
  };
}
