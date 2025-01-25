const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const cardsRouter = require("./routes/cards");
const userRouter = require("./routes/users");
const notFoundErrorRouter = require("./routes/notFoundError");
const { createUserValid, loginValid } = require("./middlewares/validation");

const { login, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const errorsHandler = require("./middlewares/errorsHandler");

const app = express();
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const allowedCors = ["http://localhost:3000", "http://localhost:4000"];

app.use(
  cors({
    origin: allowedCors,
    credentials: true,
  })
);

const { PORT = 4000 } = process.env;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  if (req.method === "OPTIONS") {
    res.status(200).send();
    return;
  }
  next();
});

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("The server is about to crash");
  }, 0);
});

app.post("/signin", loginValid, login);

app.post("/signup", createUserValid, createUser);

app.use(auth);
app.use("/", cardsRouter);
app.use("/", userRouter);

app.all("*", notFoundErrorRouter);
app.disable("x-powered-by");

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
