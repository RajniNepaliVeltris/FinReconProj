"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = getConnection;
exports.query = query;
exports.closeConnection = closeConnection;
exports.insertEventStatus = insertEventStatus;
exports.getBigCConnection = getBigCConnection;
exports.transferBigCDataToFinRecon = transferBigCDataToFinRecon;
const mssql_1 = require("mssql");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME', 'BIGC_DB_USER', 'BIGC_DB_PASSWORD', 'BIGC_DB_SERVER', 'BIGC_DB_NAME'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};
let pool = null;
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pool) {
            pool = new mssql_1.ConnectionPool(config);
            yield pool.connect();
        }
        return pool;
    });
}
function query(sql_1) {
    return __awaiter(this, arguments, void 0, function* (sql, params = []) {
        const connection = yield getConnection();
        const request = connection.request();
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });
        return request.query(sql);
    });
}
function closeConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool) {
            yield pool.close();
            pool = null;
        }
    });
}
function insertEventStatus(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield query('INSERT INTO EventStatus (id, name, price) OUTPUT INSERTED.id VALUES (@param0, @param1, @param2)', [data.id, data.name, data.price]);
        return result.recordset[0].id;
    });
}
const bigCConfig = {
    user: process.env.BIGC_DB_USER,
    password: process.env.BIGC_DB_PASSWORD,
    server: process.env.BIGC_DB_SERVER,
    database: process.env.BIGC_DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};
let bigCPool = null;
function getBigCConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!bigCPool) {
            bigCPool = new mssql_1.ConnectionPool(bigCConfig);
            yield bigCPool.connect();
        }
        return bigCPool;
    });
}
function transferBigCDataToFinRecon() {
    return __awaiter(this, void 0, void 0, function* () {
        const bigCConnection = yield getBigCConnection();
        const finReconConnection = yield getConnection();
        // Retrieve JSON data from devdb-bigC
        const bigCResult = yield bigCConnection.request().query('SELECT * FROM BigCData');
        const bigCData = bigCResult.recordset;
        // Insert JSON data into finrecon-dev
        for (const data of bigCData) {
            yield finReconConnection.request()
                .input('id', data.id)
                .input('name', data.name)
                .input('price', data.price)
                .query('INSERT INTO FinReconData (id, name, price) VALUES (@id, @name, @price)');
        }
    });
}
