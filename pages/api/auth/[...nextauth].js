import NextAuth from 'next-auth'

import EmailProvider from "next-auth/providers/email";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
    site: process.env.NEXTAUTH_URL,
    providers: [
        EmailProvider({
            server: {
                port: 465,
                host: process.env.EMAIL_HOST,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            from: process.env.EMAIL_USER,
        }),
    ],

    database: process.env.DB_URI,
    secret: process.env.SECRET,

    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    jwt: {
        secret: process.env.SECRET, //use a random secret token here
        encryption: true,
    },

    debug: true,
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async signIn({ user }) {
            const acceptedEmails = process.env.ACCEPTED_EMAILS?.split(',');
            if (acceptedEmails) {
                return acceptedEmails.includes(user.email);
            }
            return false;
        }
    }
})