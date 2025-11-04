// auth.ts
import prisma from "@/db";
import { email } from "@/helpers/email/resend";
import { ForgotPasswordSchema } from "@/helpers/zod/forgot-password-schema";
import SignInSchema from "@/helpers/zod/login-schema";
import { PasswordSchema, SignupSchema } from "@/helpers/zod/signup-schema";
import { twoFactorSchema } from "@/helpers/zod/two-factor-schema";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  twoFactor, admin as adminPlugin,
  customSession,
} from "better-auth/plugins";
import { validator } from "validation-better-auth";
import { ac, admin, employee, user } from "@/lib/permissions"

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: true, // don't allow user to set role
      }
    }
  },
  appName: "daikin-coins",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600 * 24 * 3,
    sendResetPassword: async ({ user, url, token }: { user: any; url: string; token: string }, request?: any) => {
      await email.sendMail({
        from: "Lawhub <test@lawhub.pl>",
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }: { user: any; url: string }) => {
      await email.sendMail({
        from: "Lawhub <test@lawhub.pl>",
        to: user.email,
        subject: "Email Verification",
        html: `Click the link to verify your email: ${url}`,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 12,
    freshAge: 60 * 60 * 1,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache duration in seconds
    }
  },
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          await email.sendMail({
            from: "Lawhub <test@lawhub.pl>",
            to: user.email,
            subject: "Two Factor",
            html: `Your OTP is ${otp}`,
          });
        },
      },
      skipVerificationOnEnable: true,
    }),
    validator([
      { path: "/sign-up/email", schema: SignupSchema },
      { path: "/sign-in/email", schema: SignInSchema },
      { path: "/two-factor/enable", schema: PasswordSchema },
      { path: "/two-factor/disable", schema: PasswordSchema },
      { path: "/two-factor/verify-otp", schema: twoFactorSchema },
      { path: "/forgot-password", schema: ForgotPasswordSchema },
    ]),
    nextCookies(),
    adminPlugin({
      defaultRole: "user",
      impersonationSessionDuration: 60 * 60 * 24,
      defaultBanReason: "Spamming",
      ac,
      roles: {
        admin,
        user,
        employee
      }
    }),
    customSession(async ({user, session}) => {
      const response = await prisma.user.findUnique({
                where: { id: session.userId },
                select: { role: true, twoFactorEnabled: true }
            });
      const role = response?.role || "user";
      const twoFactorEnabled = response?.twoFactorEnabled || false;
      return {
        user: {
          ...user,
          role,
          twoFactorEnabled
        },
        session
      }
    })
  ],
});
