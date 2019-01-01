"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var ws = require("ws");
var fs = require("fs");
var util = require("util");
var https = require("https");
var http = require("http");
var buttplug_1 = require("buttplug");
var buttplug_node_bluetoothle_manager_1 = require("buttplug-node-bluetoothle-manager");
var selfsigned = require("selfsigned");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var wsServer, server, attrs, pems, existsAsync, _a, server, bs, rl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    process.on("unhandledRejection", function (reason, p) {
                        console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
                        // application specific logging, throwing an error, or other logic here
                    });
                    commander
                        .version("0.0.1-alpha")
                        .option("-p, --port <number>", "Port to listen on, defaults to 12345.", 12345)
                        .option("--nossl", "If passed, do not use SSL. Needed for ScriptPlayer. SSL on by default otherwise.", false)
                        .parse(process.argv);
                    if (!commander.nossl) return [3 /*break*/, 1];
                    console.log("Not using SSL.");
                    server = http.createServer().listen(commander.port);
                    wsServer = new ws.Server({ server: server });
                    return [3 /*break*/, 5];
                case 1:
                    console.log("Using SSL.");
                    attrs = [{
                            name: "commonName",
                            value: "buttplug.localhost",
                        }, {
                            name: "organizationName",
                            value: "Metafetish",
                        }];
                    pems = {};
                    existsAsync = util.promisify(fs.exists);
                    return [4 /*yield*/, existsAsync("cert.pem")];
                case 2:
                    _a = (_b.sent());
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, existsAsync("private.pem")];
                case 3:
                    _a = (_b.sent());
                    _b.label = 4;
                case 4:
                    if (_a) {
                        console.log("Loading keys");
                        pems.cert = fs.readFileSync("cert.pem");
                        pems.private = fs.readFileSync("private.pem");
                    }
                    else {
                        console.log("Creating keys");
                        pems = selfsigned.generate(undefined, { days: 365 });
                        fs.writeFileSync("cert.pem", pems.cert);
                        fs.writeFileSync("private.pem", pems.private);
                    }
                    server = https.createServer({
                        cert: pems.cert,
                        key: pems.private,
                    }).listen(commander.port);
                    wsServer = new ws.Server({ server: server });
                    _b.label = 5;
                case 5:
                    console.log("Listening on port " + commander.port);
                    bs = new buttplug_1.ButtplugServer();
                    bs.AddDeviceManager(new buttplug_node_bluetoothle_manager_1.ButtplugNodeBluetoothLEDeviceManager());
                    wsServer.on("connection", function connection(client) {
						console.log("wsServer.on(connection)");
                        var _this = this;
                        client.on("message", function (message) { return __awaiter(_this, void 0, void 0, function () {
							console.log("client.on(message)");
                            var msg, _i, msg_1, m, outgoing;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        msg = buttplug_1.FromJSON(message);
                                        _i = 0, msg_1 = msg;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < msg_1.length)) return [3 /*break*/, 4];
                                        m = msg_1[_i];
                                        return [4 /*yield*/, bs.SendMessage(m)];
                                    case 2:
                                        outgoing = _a.sent();
                                        client.send("[" + outgoing.toJSON() + "]");
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        bs.on("message", function outgoing(message) {
                            client.send("[" + message.toJSON() + "]");
                        });
                    });
                    if (process.platform === "win32") {
                        rl = require("readline").createInterface({
                            input: process.stdin,
                            output: process.stdout,
                        });
                        // rl.on("SIGINT", () => {
                        //   process.emit("SIGINT");
                        // });
                    }
                    process.on("SIGINT", function () {
                        process.exit();
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=index.js.map