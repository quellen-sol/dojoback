var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var _this = this;
// require('firebase/firestore'); //I dont think we'll need this atm
require("dotenv").config();
var mongoose = require("mongoose");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var discordOauth2 = require("discord-oauth2");
var stripe = require("stripe")(process.env.stripeSK);
var https = require("https");
var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "thedojodiscord@gmail.com",
        pass: process.env.emailPass
    },
    tls: {
        rejectUnauthorized: false
    }
});
var app = express();
var oauth = new discordOauth2();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://quellen:" +
    process.env.mongopass +
    "@cluster0.jxtal.mongodb.net/dojodb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
//Schemas
var BIPlayerSchema = new mongoose.Schema({
    discordUsername: String,
    steamID: String
});
var GiveawayEntrantSchema = new mongoose.Schema({
    discordUsername: String
});
var VIPCustomerSchema = new mongoose.Schema({
    vipsteamID: String,
    purchasedate: Date,
    paymentIntent: String
});
var GameStatesSchema = new mongoose.Schema({
    giveawaysActive: Boolean,
    baseInvadersActive: Boolean
});
var StoreProductSchema = new mongoose.Schema({
    prodObj: String,
    name: String,
    type: String
});
//Models
var BIPlayer = mongoose.model("BIPlayer", BIPlayerSchema);
var GiveawayEntrant = mongoose.model("GiveawayEntrant", GiveawayEntrantSchema);
var VIPCustomer = mongoose.model("VIPCustomer", VIPCustomerSchema);
var GameState = mongoose.model("GameState", GameStatesSchema);
var StoreProduct = mongoose.model("StoreProduct", StoreProductSchema);
var theStateId = "5fec3262c936d15a08ae0269";
function getGameStates() {
    return __awaiter(this, void 0, void 0, function () {
        var cState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GameState.findById(theStateId).exec()];
                case 1:
                    cState = _a.sent();
                    return [2 /*return*/, cState];
            }
        });
    });
}
function sendToDiscord(message) {
    return __awaiter(this, void 0, void 0, function () {
        var sendWebhook;
        return __generator(this, function (_a) {
            sendWebhook = https.request(process.env.discordWebhook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            sendWebhook.write(JSON.stringify({
                content: message,
                avatar_url: "https://sbp-plugin-images.s3.eu-west-1.amazonaws.com/technologies1905_5eb57bd25635d_icon.jpg"
            }));
            sendWebhook.end();
            return [2 /*return*/];
        });
    });
}
function sendToDaily(message) {
    return __awaiter(this, void 0, void 0, function () {
        var sendWebhook;
        return __generator(this, function (_a) {
            sendWebhook = https.request(process.env.rustDailyWebhook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            sendWebhook.write(JSON.stringify({
                content: message
            }));
            sendWebhook.end();
            return [2 /*return*/];
        });
    });
}
app.get("/ping", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("Pong! Data: " + req.query['data']);
        return [2 /*return*/];
    });
}); });
app.get("/biplayers", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var key, biplayers, allBIDocs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query["key"];
                if (key != process.env.stateEditKey) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                biplayers = {};
                return [4 /*yield*/, BIPlayer.find(function (err, data) {
                        if (!err) {
                            data.map(function (v) { return (biplayers[v.discordUsername] = v.steamID); });
                        }
                        else {
                            console.log("Error retrieving all BIPlayers");
                        }
                    })];
            case 1:
                allBIDocs = _a.sent();
                res.json(biplayers).send();
                return [2 /*return*/];
        }
    });
}); });
app.get("/gaentries", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var key, gaentrants, allBIDocs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query["key"];
                if (key != process.env.stateEditKey) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                gaentrants = [];
                return [4 /*yield*/, GiveawayEntrant.find(function (err, data) {
                        if (!err) {
                            data.map(function (v) { return gaentrants.push(v.discordUsername); });
                        }
                        else {
                            console.log("Error retrieving all GiveawayEntrants");
                        }
                    })];
            case 1:
                allBIDocs = _a.sent();
                res.json(gaentrants).send();
                return [2 /*return*/];
        }
    });
}); });
app.post("/clearBI", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.body["key"];
                if (key != process.env.stateEditKey) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, BIPlayer.deleteMany({}, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send();
                        }
                        else {
                            res.status(200).send();
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post("/clearGA", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.body["key"];
                if (key != process.env.stateEditKey) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, GiveawayEntrant.deleteMany({}, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send();
                        }
                        else {
                            res.status(200).send();
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.get("/states", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getGameStates()];
            case 1:
                state = _a.sent();
                res.json({ BI: state.baseInvadersActive, GA: state.giveawaysActive });
                return [2 /*return*/];
        }
    });
}); });
app.post("/setStates", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, GA, BI, key;
    return __generator(this, function (_b) {
        _a = req.body, GA = _a.GA, BI = _a.BI, key = _a.key;
        if ((GA == undefined && BI == undefined) || key == undefined) {
            res.status(500).send();
            return [2 /*return*/];
        }
        if (key == process.env.stateEditKey) {
            if ("GA" in req.body) {
                GameState.findByIdAndUpdate(theStateId, { giveawaysActive: GA }, { useFindAndModify: false }, function (err, data) {
                    if (!err) {
                        res.status(200);
                    }
                    else {
                        res.status(500);
                    }
                });
                if (res.statusCode == 500) {
                    res.send();
                    return [2 /*return*/];
                }
            }
            if ("BI" in req.body) {
                GameState.findByIdAndUpdate(theStateId, { baseInvadersActive: BI }, { useFindAndModify: false }, function (err, data) {
                    if (!err) {
                        res.status(200);
                    }
                    else {
                        res.status(500);
                    }
                });
            }
            res.send();
            return [2 /*return*/];
        }
        else {
            res.status(500).send();
            return [2 /*return*/];
        }
        return [2 /*return*/];
    });
}); });
app.get("/products", function (req, res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
app.post("/buyvip", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var resp, steamid, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resp = { exists: false, sessionid: "" };
                steamid = req.body["steamid"];
                if (!steamid) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, VIPCustomer.findOne({ vipsteamID: steamid }, function (error, data) {
                        if (data != null) {
                            resp.exists = true;
                            res.json(resp).send();
                            return;
                        }
                    })];
            case 1:
                _a.sent();
                if (!!resp.exists) return [3 /*break*/, 3];
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        mode: "payment",
                        cancel_url: process.env.stripeCancel,
                        success_url: process.env.stripeSuccess,
                        line_items: [{ price: process.env.stripeVIP, quantity: 1 }],
                        payment_intent_data: {
                            metadata: { steamID: steamid, type: "vip" }
                        }
                    })];
            case 2:
                session = _a.sent();
                resp.sessionid = session.id;
                res.json(resp);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/buycoins", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, steamid, quantity, session;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, steamid = _a.steamid, quantity = _a.quantity;
                quantity = parseInt(quantity);
                if (!steamid || !quantity || isNaN(quantity)) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        mode: "payment",
                        cancel_url: process.env.stripeCancel,
                        success_url: process.env.stripeSuccess,
                        line_items: [{ price: process.env.stripe1000, quantity: quantity }],
                        payment_intent_data: {
                            metadata: { steamID: steamid, type: "coins", quant: quantity }
                        }
                    })];
            case 1:
                session = _b.sent();
                res.json({ sessionid: session.id });
                return [2 /*return*/];
        }
    });
}); });
app.post("/buyvip5x", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var resp, steamid, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resp = { exists: false, sessionid: "" };
                steamid = req.body["steamid"];
                if (!steamid) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, VIPCustomer.findOne({ vipsteamID: steamid }, function (error, data) {
                        if (data != null) {
                            resp.exists = true;
                            res.json(resp).send();
                            return;
                        }
                    })];
            case 1:
                _a.sent();
                if (!!resp.exists) return [3 /*break*/, 3];
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        mode: "payment",
                        cancel_url: 'https://dojogaming.us/servers',
                        success_url: process.env.stripeSuccess,
                        line_items: [{ price: process.env.stripeVIP5X, quantity: 1 }],
                        payment_intent_data: {
                            metadata: { steamID: steamid, type: "vip5x" }
                        }
                    })];
            case 2:
                session = _a.sent();
                resp.sessionid = session.id;
                res.json(resp);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/buycoins5x", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, steamid, quantity, session;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, steamid = _a.steamid, quantity = _a.quantity;
                quantity = parseInt(quantity);
                if (!steamid || !quantity || isNaN(quantity)) {
                    res.status(500).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        mode: "payment",
                        cancel_url: 'https://dojogaming.us/servers',
                        success_url: process.env.stripeSuccess,
                        line_items: [
                            { price: process.env.stripe5XCoins10, quantity: quantity },
                        ],
                        payment_intent_data: {
                            metadata: { steamID: steamid, type: "coins5x", quant: quantity }
                        }
                    })];
            case 1:
                session = _b.sent();
                res.json({ sessionid: session.id });
                return [2 /*return*/];
        }
    });
}); });
//5X!
//Issues with this
app.get("/5xrustdaily", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var code;
    return __generator(this, function (_a) {
        code = req.query["code"];
        if (code) {
            oauth
                .tokenRequest({
                clientId: "753807367484735568",
                clientSecret: process.env.clientSecret,
                grantType: "authorization_code",
                redirectUri: process.env.rustDailyRedirect5X,
                code: code,
                scope: "identify connections"
            })["catch"](function (err) {
                console.log("Error on token request with /rustdaily5x: " + err);
                res.status(500).send();
            })
                .then(function (tokenRes) {
                oauth
                    .getUser(tokenRes.access_token)["catch"](function (err2) {
                    console.log("Error on getUser() request from /rustdaily5x: " + err2);
                    res.status(500).send();
                })
                    .then(function (userData) {
                    var discordId = userData.id;
                    oauth
                        .getUserConnections(tokenRes.access_token)["catch"](function (err3) {
                        console.log("Error on getUserConnections from /rustdaily: " + err3);
                        res.status(500).send();
                    })
                        .then(function (connections) {
                        var steamId;
                        console.log(connections);
                        for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
                            var conn = connections_1[_i];
                            if (conn.type == "steam") {
                                steamId = conn.id;
                                console.log("Set steamid");
                            }
                        }
                        if (steamId) {
                            sendToDaily("5XDAILY " + discordId + " " + steamId);
                            res.json({
                                nosteam: false,
                                success: true
                            }).send();
                        }
                        else {
                            res.json({ nosteam: true }).send();
                        }
                    });
                });
            });
        }
        else {
            console.log("No code");
            res.status(500).send();
        }
        return [2 /*return*/];
    });
}); });
app.get("/rustdaily", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var code;
    return __generator(this, function (_a) {
        code = req.query["code"];
        if (code) {
            oauth
                .tokenRequest({
                clientId: "753807367484735568",
                clientSecret: process.env.clientSecret,
                grantType: "authorization_code",
                redirectUri: process.env.rustDailyRedirect,
                code: code,
                scope: "identify connections"
            })["catch"](function (err) {
                console.log("Error on token request with /rustdaily: " + err);
                res.status(500).send();
            })
                .then(function (tokenRes) {
                oauth
                    .getUser(tokenRes.access_token)["catch"](function (err2) {
                    console.log("Error on getUser() request from /rustdaily: " + err2);
                    res.status(500).send();
                })
                    .then(function (userData) {
                    var discordId = userData.id;
                    oauth
                        .getUserConnections(tokenRes.access_token)["catch"](function (err3) {
                        console.log("Error on getUserConnections from /rustdaily: " + err3);
                        res.status(500).send();
                    })
                        .then(function (connections) {
                        var steamId;
                        console.log(connections);
                        for (var _i = 0, connections_2 = connections; _i < connections_2.length; _i++) {
                            var conn = connections_2[_i];
                            if (conn.type == "steam") {
                                steamId = conn.id;
                                console.log('Set steamid');
                            }
                        }
                        if (steamId) {
                            sendToDaily("DAILY " + discordId + " " + steamId);
                            res.json({ nosteam: false, success: true }).send();
                        }
                        else {
                            res.json({ nosteam: true }).send();
                        }
                    });
                });
            });
        }
        else {
            console.log('No code');
            res.status(500).send();
        }
        return [2 /*return*/];
    });
}); });
app.post("/payments", function (req, res) {
    var intent = {};
    try {
        intent = req.body.data.object;
        if (req.body.type == "payment_intent.succeeded") {
            var steamid_1 = intent.metadata.steamID;
            var receipt = intent.charges.data[0].receipt_url;
            var email = intent.charges.data[0].billing_details.email;
            var cust_name = intent.charges.data[0].billing_details.name;
            var receipt_message = {
                from: "thedojodiscord@gmail.com",
                to: email,
                subject: "The Dojo (RECEIPT): Thank you for your purchase!"
            };
            if (steamid_1) {
                receipt_message['text'] = "Thank you for purchasing from The Dojo's online store, " + cust_name + "!\nThe steam account receiving your item(s) can be found here: https://steamid.io/lookup/" + steamid_1 + "\n\nYour receipt can be found here:\n" + receipt;
            }
            else {
                receipt_message['text'] = "Thank you for purchasing from The Dojo's online store, " + cust_name + "!\n\nYour receipt can be found here:\n" + receipt;
            }
            transport.sendMail(receipt_message, function (err, info) {
                if (err) {
                    sendToDiscord("Error sending receipt email! " + err);
                    // console.log('Error with email send: '+ err);
                }
                else {
                    console.log(info);
                }
            });
            switch (intent.metadata.type) {
                case "vip5x":
                    VIPCustomer.create({
                        vipsteamID: steamid_1,
                        purchasedate: Date.now(),
                        paymentIntent: intent.id
                    })["catch"](function (err) {
                        //BIG ERROR WITH CREATING ENTRY. Notify me somehow?
                        console.log("Error with creating VIPCustomer with ID:" + steamid_1);
                    })
                        .then(function (doc) {
                        sendToDiscord("VIP5X " + steamid_1);
                    });
                    break;
                case "coins":
                    // console.log('Coins succeeded');
                    sendToDiscord("COINS " + steamid_1 + " " + intent.metadata.quant);
                case "coins5x":
                    // console.log('Coins succeeded');
                    sendToDiscord("COINS5X " + steamid_1 + " " + intent.metadata.quant);
            }
        }
    }
    catch (err) {
        console.log("Bad request sent to payments?! From " + req.ip);
        console.log(err);
    }
    res.status(200).end();
});
app.get("/giveaway", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var code, state, data;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.query["code"];
                return [4 /*yield*/, getGameStates()];
            case 1:
                state = _a.sent();
                if (code && state["giveawaysActive"]) {
                    data = {
                        clientId: "753807367484735568",
                        clientSecret: process.env.clientSecret,
                        grantType: "authorization_code",
                        code: code,
                        redirectUri: process.env.giveawayRedirectUri ||
                            "http://127.0.0.1:5500/giveawaynext.html",
                        scope: "identify"
                    };
                    oauth
                        .tokenRequest(data)["catch"](function (e1) { return console.log("Error on oauth.tokenRequrest(): " + e1); })
                        .then(function (tres) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log("Got access_token: " + tres.access_token);
                            console.log("About to run getUser()");
                            oauth
                                .getUser(tres.access_token)["catch"](function (e2) {
                                console.log("Error from oauth.getUser(): " + e2);
                            })
                                .then(function (user) {
                                var username = user.username + "#" + user.discriminator;
                                GiveawayEntrant.findOne({ discordUsername: username }, function (err, dat) {
                                    if (dat == null) {
                                        GiveawayEntrant.create({
                                            discordUsername: username
                                        }).then(function () {
                                            res.json({ exists: false }).send();
                                        });
                                    }
                                    else {
                                        res.json({ exists: true }).send();
                                    }
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); });
                }
                else {
                    res.status(500).send();
                }
                return [2 /*return*/];
        }
    });
}); });
app.get("/sign", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var code, state, data, userName_1, id_1, jsonRes_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.query["code"];
                return [4 /*yield*/, getGameStates()];
            case 1:
                state = _a.sent();
                if (code && state["baseInvadersActive"]) {
                    data = {
                        clientId: "753807367484735568",
                        clientSecret: process.env.clientSecret,
                        grantType: "authorization_code",
                        code: code,
                        redirectUri: process.env.redirectUri ||
                            "http://127.0.0.1:5500/signupnext.html",
                        scope: "connections identify"
                    };
                    userName_1 = "";
                    id_1 = "";
                    jsonRes_1 = {
                        got_code: false,
                        has_discord: false,
                        has_steam: false,
                        already_exists: false
                    };
                    oauth
                        .tokenRequest(data)
                        .then(function (res1) {
                        jsonRes_1.got_code = true;
                        oauth
                            .getUser(res1.access_token)
                            .then(function (res2) {
                            userName_1 = res2.username + "#" + res2.discriminator;
                            jsonRes_1.has_discord = true;
                            oauth
                                .getUserConnections(res1.access_token)
                                .then(function (res3) {
                                for (var _i = 0, res3_1 = res3; _i < res3_1.length; _i++) {
                                    var conn = res3_1[_i];
                                    if (conn.type == "steam") {
                                        id_1 = conn.id;
                                        jsonRes_1.has_steam = true;
                                        break;
                                    }
                                }
                                //No Steam connection
                                if (id_1 === "") {
                                    res.json(jsonRes_1);
                                    return;
                                }
                                //Check for existing player and add:
                                //d will have _doc which contains _id and the fields discordUsername and steamID
                                BIPlayer.findOne({ steamID: id_1 }, function (err, d) {
                                    if (d !== null) {
                                        jsonRes_1.already_exists = true;
                                        res.json(jsonRes_1);
                                    }
                                    else {
                                        BIPlayer.create({
                                            discordUsername: userName_1,
                                            steamID: id_1
                                        })
                                            .then(function () {
                                            res.json(jsonRes_1).send();
                                        })["catch"](function (e) {
                                            console.log("Error on creating BIPlayer?");
                                            res.status(500).send();
                                        });
                                    }
                                });
                            })["catch"](function () { return res.status(500).send(); });
                        })["catch"](function () { return res.status(500).send(); });
                    })["catch"](function () {
                        console.log("Error from Discord...");
                        res.status(500).send();
                    });
                }
                else {
                    res.status(500).send();
                }
                return [2 /*return*/];
        }
    });
}); });
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("App listening on " + port);
});
