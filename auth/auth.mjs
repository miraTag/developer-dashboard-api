import passport from "passport";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "../config.mjs";

passport.use(
    "jwt",
    new JWTstrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token);
            } catch (error) {
                done(error);
            }
        }
    )
);
