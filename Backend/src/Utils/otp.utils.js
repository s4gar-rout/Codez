import crypto from "crypto";

import { env } from "../Configs/config.js";

export const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = (otp) => {
    return crypto
        .createHmac("sha256", env.OTP_HASH_SECRET)
        .update(otp)
        .digest("hex");
};

export const compareOtp = (otp, hashedOtp) => {
    const otpHash = hashOtp(otp);

    return crypto.timingSafeEqual(
        Buffer.from(otpHash, "hex"),
        Buffer.from(hashedOtp, "hex")
    );
};