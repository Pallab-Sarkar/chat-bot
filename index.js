import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import OpenAi from "openai";
import { constants } from "./config/constants.js";
import OrgModel from "./models/OrgModel.js";
import isAuthenticate from "./middlewares/tokenService.js";
import mongoose from "mongoose";
import { config } from "./config/config.js";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
const DB_URL = config.development.db_url;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.use(cors());

app.use(bodyParser.json({ limit: "1000mb", extended: true }));
//app.use(multipart({ maxFieldsSize: '1GB'}));

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//db connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

mongoose.connection.on("connected", function () {
  console.log("Connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.log("error in Connecting to DB");
  console.error("error in connecting to db" + err);
});

const openai = new OpenAi({ apiKey: constants.OPENAI_API_KEY });

// Handle incoming messages
app.post("/chat", isAuthenticate, async (req, res) => {
  try {
    const message = req.body.message;
    const openaiResponse = await getOpenAIResponse(message);
    const reply = openaiResponse.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getOpenAIResponse(message) {
  const prompt = `${message}`;
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });
  return response;
}

app.post("/org/create", async (req, res) => {
  try {
    if (req.body.name) {
      req.body.name.toUpperCase();
    }

    if (req.body.license_key) {
      delete req.body.license_key;
    }

    const createOrg = await OrgModel.create(req.body);
    if (!createOrg) {
      return res.status(500).json({ error: "Failed to create organization" });
    }
    res.status(200).json(createOrg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/org/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({
        message: "Please enter org id !!",
      });
    }

    const findOrg = await OrgModel.findOne({ _id: req.params.id });
    if (!findOrg) {
      return res.status(500).json({ error: " organization does not exist!" });
    }
    res.status(200).json(findOrg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/org/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({
        message: "Please enter org id !!",
      });
    }

    if (!req.body) {
      return res.status(constants.HTML_STATUS_CODE.UNAUTHORIZED).json({
        message: "Invalid data !!",
      });
    }

    if (req.body.license_key) {
      let hashedLicense = await bcrypt.hash(
        req.body.license_key,
        constants.SALTROUND
      );

      req.body.license_key = hashedLicense;
    }

    const updateOrg = await OrgModel.updateOne(
      { _id: req.params.id },
      req.body
    );
    if (!updateOrg) {
      return res.status(500).json({ error: "Failed to update organization!" });
    }
    res.status(200).json(updateOrg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
