const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { config } = require("../../../../config");

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (tokenPayload, done) {
      console.log(tokenPayload);
      return done(null, tokenPayload.user);
    }
  )
);
