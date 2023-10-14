import fetch, {Headers} from "node-fetch";
import {createClient} from 'redis';
import fs from "fs";
import {sleep} from "../utils.mjs";
import {v4 as UUIDv4} from "uuid";

const headerBase = {
    "content-type": "application/json",
    "poe-tag-id": "",
    "apollographql-client-version": "2.1.0-530",
    "accept": "*/*",
    // x-apollo-operation-name
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Poe 2.1.0 rv:530 env:prod (iPhone15,3; iOS 17.0.3; en_US)",
    // "x-apollo-operation-type": "query", / "mutation" (Base on x-apollo-operation-name)
    "apollographql-client-name": "com.quora.app.Experts-apollo-ios",
    "poe-language-code": "en"
};


export class Poe {
    constructor() {
        this.endpoint = "https://www.quora.com/poe_api";
        this.headers = {...headerBase};
        this.cookies = {};
        this.webSocketInit = {  // tchannelData
            // "baseHost": "poe.com",
            // "boxName": "chan51-8888",
            // "channel": "poe-chan51-8888-umglxpatxbnrkrkssaxb",
            // "channelHash": "9102217748431051748",
            // "enableWebsocket": true,
            // "minSeq": "28284030776",
            // "targetUrl": ""
        };

        this.emailProvider = "mtf.lat";

        // This is a flag to check is header and cookie is ready
        this.isInit = false;

        try {
            this.graphQLSchemaList = JSON.parse(fs.readFileSync("./data/graphQLSchema.json", "utf-8"));
        } catch (e) {
            console.error(`Error reading GraphQL schema: ${e.message}\n${e.stack}`);
            process.exit(1);
        }
    }

    /**
     * Update Cookie values by response header
     *
     * @param {Headers} cookies - Cookies
     * @return {void}
     * @private
     */
    _updateCookies(cookies) {
        const rawHeaders = cookies.raw();
        if (rawHeaders['set-cookie'])
            for (const pair of rawHeaders['set-cookie']) {
                const pairResult = pair.split(";")[0].split("=");
                this.cookies[pairResult[0]] = pairResult.slice(1).join("=");
            }
    }

    /**
     * Get email otp code via Redis
     *
     * @param email {string} - Email address
     * @return {Promise<string|null>} - OTP code
     */
    async getEmailCode(email) {
        const redisClient = createClient({
            socket: {
                host: "redis-19683.c302.asia-northeast1-1.gce.cloud.redislabs.com",
                port: 19683
            },
            username: "default",
            password: "cgBCASrRlWpExs14mvmjdOeKlr5XnuRb",
            database: 0,
            disableOfflineQueue: true
        });
        redisClient.on("error", err => console.error(`Redis client error: ${err}`));

        try {
            await redisClient.connect();
            // if (!redisClient.connected) {
            //     console.error("Redis client not connected.");
            //     return null;
            // }
        } catch (e) {
            return null;
        }

        // Start checking for OTP code, interval 1s, timeout 2mins
        const startTime = Date.now();
        while (Date.now() - startTime < 120000) {
            const code = await redisClient.get(`poe:${email}`);
            if (code) {
                console.info(`Got OTP code: ${code}`);
                await redisClient.del(`poe:${email}`);
                await redisClient.disconnect();
                return code;
            }
            console.debug(`Waiting for OTP code... (${Math.floor((Date.now() - startTime) / 1000) + 1}s)`);
            await sleep(1000);
        }
        console.error("Timeout when waiting for OTP code.");
        await redisClient.disconnect();
        return null;
    }

    /**
     * Generate email
     *
     * @return {String} - Email
     */
    genEmail() {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let email = '';
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            email += chars[randomIndex];
        }
        return `${email}@${email}.${this.emailProvider}`;
    }

    /**
     * Generate GraphQL headers
     *
     * @param opName - Operation name
     * @return {Object} - Headers
     */
    genGraphQLHeaders(opName) {
        const headers = new Headers(Object.assign({
            "x-apollo-operation-name": opName,
            "x-apollo-operation-type": opName.endsWith("Query") ? "query" : "mutation"
        }, this.headers));
        for (const [key, value] of Object.entries(this.cookies))
            headers.append("cookie", `${key}=${value}`);

        return headers;
    }

    /**
     * Init state - Get base settings
     * Including base cookie
     *
     * @return {Promise<boolean>}
     */
    async init() {
        try {
            const resp = await fetch(`${this.endpoint}/settings?`, {
                headers: {
                    "user-agent": this.headers["user-agent"],
                    "accept": this.headers["accept"],
                    "accept-language": this.headers["accept-language"]
                }
            });
            if (resp.status !== 200) {
                console.warn(`Init failed: ${resp.status} ${resp.statusText}`);
                return false;
            }
            const respJSON = await resp.json();

            // Setup Headers
            this.headers["quora-formkey"] = respJSON["formkey"];
            this.headers["quora-tchannel"] = respJSON["tchannelData"]["channel"];
            this.webSocketInit = respJSON["tchannelData"]["enableWebsocket"] ? respJSON["tchannelData"] : null;

            // Setup Cookies
            this._updateCookies(resp.headers);

            return this.isInit = true;
        } catch (e) {
            console.error(`Init failed: ${e.message}\n${e.stack}`);
        }
        return false;
    }

    /**
     * Do GraphQL request
     *
     * The rest (query body, auth state) will handle automatically
     *
     * @param opName - Operation name
     * @param variables - (Optional) Variables
     * @return {Promise<Object | void>} - Response data
     */
    async graphQL(opName, variables = null) {
        try {
            if (!this.isInit) await this.init();
            else if (!this.graphQLSchemaList[opName]) {
                console.error(`GraphQL schema "${opName}" not found`);
                return;
            }
            const body = {
                "operationName": opName,
                "query": this.graphQLSchemaList[opName],
            };
            if (variables) body["variables"] = variables;
            const resp = await fetch(`${this.endpoint}/gql_POST`, {
                method: "POST",
                headers: this.genGraphQLHeaders(opName),
                body: JSON.stringify(body)
            });
            if (resp.status !== 200) {
                const response = resp.headers.get("content-type").includes("application/json") ? await resp.json() : await resp.text();
                console.debug(response);
                console.warn(`GraphQL request failed: ${resp.status} ${resp.statusText}`);
                return;
            }
            this._updateCookies(resp.headers);
            const respJSON = await resp.json();
            if (respJSON["errors"]) {
                console.warn(`GraphQL request failed:\n${JSON.stringify(respJSON["errors"], null, 4)}`);
                return;
            }
            return respJSON["data"];
        } catch (e) {
            console.error(`GraphQL request failed: ${e.message}\n${e.stack}`);
        }
    }

    /**
     * Get quota info
     *
     * @return {Promise<Object|void>}
     */
    async getQuotas() {
        const data = await this.graphQL("SettingsPageQuery", {
            "after": null,
            "first": 10
        });
        if (!data) return;
        return data["viewer"];
    }

    /**
     * Get user info
     *
     * @return {Promise<Object|void>}
     */
    async getUserInfo() {
        const data = await this.graphQL("ViewerInfoQuery");
        if (!data) return;
        return data["viewer"];
    }

    /**
     * Send Email Code for login
     *
     * @param {string} email - Email address
     * @return {Promise<Object|void>} - Result
     */
    async sendEmailCode(email) {
        const data = await this.graphQL("SendVerificationCodeForLoginMutation", {
            "emailAddress": email,
            "recaptchaToken": ""
        });
        if (!data) return;
        const result = data["sendVerificationCode"];
        if (!result) return;
        if (result["errorMessage"]) {
            console.warn(`Send email code failed:\n${JSON.stringify(result["errorMessage"], null, 4)}`);
            return;
        }
        return result;
    }

    /**
     * Verify email code and Login / Register
     *
     * @param {string} email - Email address
     * @param {string} code - Verification code
     * @return {Promise<boolean|void>} - Result
     */
    async verifyEmailCode(email, code) {
        const data = await this.graphQL("SignupWithVerificationCodeMutation", {
            "emailAddress": email,
            "verificationCode": code
        });
        if (!data) return;
        const result = data["signupWithVerificationCode"];
        if (!result) {
            console.warn(`Verify email code failed:\n${JSON.stringify(data, null, 4)}`);
            return;
        }
        return true;
    }

    /**
     * Apple IAP (In-App Purchase)
     *
     * @return {Promise<boolean|void>} - Result
     */
    async appleIAP() {
        const nowTimestamp = Math.floor(Date.now() / 1000), nextYearTimestamp = nowTimestamp + 31536000;
        const transactionId = "3500017254" + String(Math.floor(Math.random() * (99999 - 60000 + 1)) + 60000);
        const transaction = {
            appAccountToken: UUIDv4(), // UUID4
            environment: "Production",
            expiresDateSeconds: nextYearTimestamp, // originalPurchaseDateSeconds + 1 year
            isUpgraded: false,
            latestTransactionId: transactionId,
            offerType: "yearly",
            originalPurchaseDateSeconds: nowTimestamp,
            originalTransactionId: transactionId,  // TODO
            ownershipType: "PURCHASED",
            productId: "com.quora.app.poe.annual_subscription",
            productType: "Auto-Renewable Subscription",
            purchaseDateSeconds: nowTimestamp - 2, // originalPurchaseDateSeconds - 2
            webOrderLineItemId: "350000814930384"
        }
        const data = await this.graphQL("AppleInAppPurchasesUpdatePurchaseMutation", {
            botsPerPage: 10,
            transaction
        });
        if (!data) return;
        if (data["errors"]) {
            console.warn(`Apple IAP failed:\n${JSON.stringify(data["errors"], null, 4)}`);
            return;
        }
        return true;
    }

    /**
     * Logout current device
     *
     * @return {Promise<void>} - Result
     */
    async logout() {
        await this.graphQL("LogoutMutation");
    }
}
