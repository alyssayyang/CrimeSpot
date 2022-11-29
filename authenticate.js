const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const GOOGLE_CLIENT_ID = '1037721089178-vmuka7g9fioqcn7gf8a7a3jt7j7trq3v.apps.googleusercontent.com'
const  GOOGLE_CLIENT_SECRET = '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'

// const User = require('user');

passport.serializeUser((user,done) => {
    done(null,user);
});

passport.deserializeUser((user,done) => {
    done(null,user);
});

passport.use(new GoogleStrategy({
    clientID:   GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5500/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {   
      
    
    return done(null, profile);
  }
));