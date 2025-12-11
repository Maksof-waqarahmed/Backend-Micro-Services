import express from "express";
import userAuthRoute from "./user-auth-route";

const app = express();

app.use("/userAuth", userAuthRoute);

export default app;