const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
// const { User } = require("../models");

// Set mechanism to retrieve Jwt token from user request
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Implement verify callback for passport strategy to find the user whose token is passed
const jwtVerify = async (payload, done) => {
  try {
    // Check if the token type is "ACCESS"
    if (payload.type !== tokenTypes.ACCESS) {
      return done(null, false, { message: "Invalid token type" });
    }

    // Find the user based on the ID in the payload
    const user = await User.findById(payload.sub);

    // If user not found, handle it as unauthorized
    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    // If user is found, return the user
    return done(null, user);
  } catch (error) {
    // Handle any errors that occurred during user retrieval
    return done(error, false);
  }
};

// Create the JWT strategy using jwtOptions and jwtVerify
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
