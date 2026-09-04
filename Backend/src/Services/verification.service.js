import User from "../Models/user.model.js";

import {
    setRedis,
    getRedis,
    deleteRedis,
    incrementRedis,
    expireRedis,
} from "../Utils/redis.utils.js";

import {
    generateOtp,
    hashOtp,
    compareOtp,
} from "../Utils/otp.utils.js";

import {
    sendVerificationEmail,
    sendForgotPasswordEmail,
} from "./email.service.js";

const OTP_EXPIRY = 10 * 60;

const RESEND_COOLDOWN = 60;

const MAX_VERIFY_ATTEMPTS = 5;

const MAX_RESEND_COUNT = 5;

const RESEND_WINDOW = 60 * 60;

const getOtpKey = (userId) =>
    `email-verification:otp:${userId}`;

const getAttemptKey = (userId) =>
    `email-verification:attempts:${userId}`;

const getCooldownKey = (userId) =>
    `email-verification:cooldown:${userId}`;

const getResendKey = (userId) =>
    `email-verification:resends:${userId}`;


export const createAndSendVerificationOtp = async ({
    user,
}) => {
    if (user.isEmailVerified) {
        const error = new Error(
            "Email is already verified"
        );

        error.statusCode = 400;

        throw error;
    }

    const cooldownExists = await getRedis(
        getCooldownKey(user._id)
    );

    if (cooldownExists) {
        const error = new Error(
            "Please wait before requesting another OTP"
        );

        error.statusCode = 429;

        throw error;
    }

    const resendCount = await incrementRedis(
        getResendKey(user._id)
    );

    if (resendCount === 1) {
        await expireRedis(
            getResendKey(user._id),
            RESEND_WINDOW
        );
    }

    if (resendCount > MAX_RESEND_COUNT) {
        const error = new Error(
            "Too many OTP requests. Please try again later"
        );

        error.statusCode = 429;

        throw error;
    }

    const otp = generateOtp();

    const hashedOtp = hashOtp(otp);

    await setRedis(
        getOtpKey(user._id),
        {
            otp: hashedOtp,
            createdAt: new Date().toISOString(),
        },
        OTP_EXPIRY
    );

    await setRedis(
        getCooldownKey(user._id),
        true,
        RESEND_COOLDOWN
    );

    await deleteRedis(
        getAttemptKey(user._id)
    );

    try {
        await sendVerificationEmail({
            email: user.email,
            username: user.username,
            otp,
        });
    } catch (error) {
        await deleteRedis(getOtpKey(user._id));
        await deleteRedis(getCooldownKey(user._id));

        throw error;
    }
};


export const verifyEmailOtp = async ({
    email,
    otp,
}) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or OTP");
        error.statusCode = 400;
        throw error;
    }

    if (user.isEmailVerified) {
        return user;
    }

    const otpData = await getRedis(
        getOtpKey(user._id)
    );

    if (!otpData) {
        const error = new Error(
            "OTP expired or not found"
        );

        error.statusCode = 400;
        throw error;
    }

    const attempts = await incrementRedis(
        getAttemptKey(user._id)
    );

    if (attempts === 1) {
        await expireRedis(
            getAttemptKey(user._id),
            OTP_EXPIRY
        );
    }

    if (attempts > MAX_VERIFY_ATTEMPTS) {
        await deleteRedis(getOtpKey(user._id));
        await deleteRedis(getAttemptKey(user._id));

        const error = new Error(
            "Too many incorrect attempts. Please request a new OTP"
        );

        error.statusCode = 429;
        throw error;
    }

    let isValid = false;

    try {
        isValid = compareOtp(
            otp,
            otpData.otp
        );
    } catch {
        isValid = false;
    }

    if (!isValid) {
        const remainingAttempts =
            MAX_VERIFY_ATTEMPTS - attempts;

        const error = new Error(
            `Invalid OTP. ${remainingAttempts} attempts remaining`
        );

        error.statusCode = 400;
        throw error;
    }

    user.isEmailVerified = true;

    await user.save();

    await deleteRedis(getOtpKey(user._id));
    await deleteRedis(getAttemptKey(user._id));
    await deleteRedis(getCooldownKey(user._id));

    return user;
};

const getForgotPasswordOtpKey = (userId) =>
    `forgot-password:otp:${userId}`;

const getForgotPasswordAttemptKey = (userId) =>
    `forgot-password:attempts:${userId}`;

export const createAndSendForgotPasswordOtp = async ({
    user,
}) => {
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    await setRedis(
        getForgotPasswordOtpKey(user._id),
        {
            otp: hashedOtp,
            createdAt: new Date().toISOString(),
        },
        OTP_EXPIRY
    );

    await deleteRedis(
        getForgotPasswordAttemptKey(user._id)
    );

    try {
        await sendForgotPasswordEmail({
            email: user.email,
            username: user.username,
            otp,
        });
    } catch (error) {
        await deleteRedis(
            getForgotPasswordOtpKey(user._id)
        );

        throw error;
    }
};

export const verifyForgotPasswordOtp = async ({
    user,
    otp,
}) => {
    const otpData = await getRedis(
        getForgotPasswordOtpKey(user._id)
    );

    if (!otpData) {
        const error = new Error(
            "OTP expired or not found"
        );

        error.statusCode = 400;
        throw error;
    }

    const attempts = await incrementRedis(
        getForgotPasswordAttemptKey(user._id)
    );

    if (attempts === 1) {
        await expireRedis(
            getForgotPasswordAttemptKey(user._id),
            OTP_EXPIRY
        );
    }

    if (attempts > MAX_VERIFY_ATTEMPTS) {
        await deleteRedis(
            getForgotPasswordOtpKey(user._id)
        );

        await deleteRedis(
            getForgotPasswordAttemptKey(user._id)
        );

        const error = new Error(
            "Too many incorrect attempts. Please request a new OTP"
        );

        error.statusCode = 429;
        throw error;
    }

    let isValid = false;

    try {
        isValid = compareOtp(
            otp,
            otpData.otp
        );
    } catch {
        isValid = false;
    }

    if (!isValid) {
        const remainingAttempts =
            MAX_VERIFY_ATTEMPTS - attempts;

        const error = new Error(
            `Invalid OTP. ${remainingAttempts} attempts remaining`
        );

        error.statusCode = 400;
        throw error;
    }

    await deleteRedis(
        getForgotPasswordOtpKey(user._id)
    );

    await deleteRedis(
        getForgotPasswordAttemptKey(user._id)
    );

    return true;
};