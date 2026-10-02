import {Router} from "express";

import {checkDatabaseConnection} from "../config/database";

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
    const databaseConnected = await checkDatabaseConnection();
    res.status(databaseConnected ? 200 : 500).json({
        status: databaseConnected ? 'ok' : 'degraded',
        database: databaseConnected ? 'connected' : 'unreachable',
        timestamp: new Date().toISOString(),
    });
});