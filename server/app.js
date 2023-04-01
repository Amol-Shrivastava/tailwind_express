require("dotenv").config();
require("express-async-errors");

const express = require("express");
const consola = require("consola");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//middleware
const app = express();
const connectDB = require("./connect");
const regRouter = require("./routes/authentication");
// const { authenticationHandler } = require("./middlewares/authentication");
const contentRouter = require("./routes/content");
const tasksRouter = require("./routes/tasks");

const PORT = process.env.PORT || 4000;

const sessionDBStore = new MongoDBStore({
  uri: process.env.MONGOOSE_URI,
  collection: "session_id",
  databaseName: "tailwind_login",
});

sessionDBStore.on("error", (error) => {
  consola.error(error);
});

//invocation
app.use(express.json());
app.use("/public", express.static("../client"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 1000, //1day
    },
    store: sessionDBStore,
  })
);

app.get("/", async (req, res) => {
  if (!req.session.userId) return res.redirect("public/pages/login.html");
  return res.redirect("public/pages/content/dashboard.html");
});

app.use("/auth", regRouter);
app.use("/content", contentRouter);
app.use("/tasks", tasksRouter);

const start = async () => {
  try {
    //1. start DB
    await connectDB(process.env.MONGOOSE_URI);
    consola.success(`Successfully connected to DB`);

    //2. Start Server
    app.listen(PORT, (err) => {
      if (err) consola.error(err);
      consola.success(`Server started at ${PORT}`);
    });
  } catch (error) {
    consola.error(error);
  }
};

try {
  start();
} catch (error) {
  consola.error(`Error in starting DB or server`);
  consola.error(error);
}
