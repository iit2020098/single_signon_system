// server.js
const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: "YOUR_GITHUB_CLIENT_ID",
      clientSecret: "YOUR_GITHUB_CLIENT_SECRET",
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user data after successful GitHub authentication
      // Typically, you would create or retrieve a user in your database here
      return done(null, profile);
    }
  )
);

// Configure Google OAuth strategy (similar to GitHub)
passport.use(
  new GoogleStrategy(
    {
      clientID: "YOUR_GOOGLE_CLIENT_ID",
      clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user data after successful Google authentication
      // Typically, you would create or retrieve a user in your database here
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes for initiating GitHub and Google OAuth authentication
app.get("/auth/github", passport.authenticate("github"));
app.get("/auth/github/callback", passport.authenticate("github"), (req, res) => {
  res.redirect("/FirstVisit"); // Redirect to the desired page after GitHub sign-up
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/FirstVisit"); // Redirect to the desired page after Google sign-up
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
