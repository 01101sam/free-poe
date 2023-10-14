import {Poe} from "./module/poe.mjs";
import fs from "fs";

(async () => {
    let result, count = 0, maxCount = 97;
    while (count < maxCount) {
        const poe = new Poe();
        console.log(`Initializing...`);
        await poe.init();
        const email = poe.genEmail();
        console.log(`Email: ${email}`);
        result = await poe.sendEmailCode(email);
        if (!result) {
            console.log(`Failed to send email code.`);
            continue;
        }
        console.log(`Getting OTP...`);
        const otp = await poe.getEmailCode(email);
        console.log(`OTP: ${otp}`);
        console.log(`Verifying OTP...`);
        result = await poe.verifyEmailCode(email, otp);
        if (!result) {
            console.log(`Failed to verify email code.`);
            continue;
        }
        console.log(`Getting account info...`);
        result = await poe.getUserInfo();
        if (!result) {
            console.log(`Failed to get user info.`);
            continue;
        }
        console.log(`Getting quotas...`);
        result = await poe.getQuotas();
        if (!result) {
            console.log(`Failed to get quotas.`);
            continue;
        }
        console.log(`Doing Apple IAP action...`);
        result = await poe.appleIAP();
        if (!result) {
            console.log(`Failed to do Apple IAP action.`);
            continue;
        }
        console.log(`Getting account info...`);
        result = await poe.getUserInfo();
        if (!result) {
            console.log(`Failed to get user info.`);
            continue;
        }
        console.log(`Checking subscription...`);
        if (!result['subscription']['isActive']) {
            console.log(`Subscription is not active.`);
            continue;
        }
        console.log(`Logging out...`);
        await poe.logout();
        // Append email
        fs.writeFileSync("alt-list.txt", `${email}\n`, {flag: "a"});
        count++;
        console.log(`Account ${count}/${maxCount} done.`);
    }
})();
