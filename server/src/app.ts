import express from "express";
import cors from "cors";
import {env} from "./config/env";
// import {apiRouter} from "./routes";
// import {errorHandler} from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json({limit: "2mb"}));

// app.use("/api/v1", apiRouter);

app.use("/ping", (_req,res) =>{
    res.send("pong");
});
app.use((req, res) => {
    res.status(404).json({error: `No route for ${req.method} ${req.path} `});
})

// app.use(errorHandler);

app.listen(env.port, () =>{
    console.log(`Server listening on http://localhost:${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/api/v1/health`)
})
