import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/model/User/User";
import dbconnection from "@/database/database";
import bcrypt from "bcryptjs";
import { Credentials } from "@/types/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Credentials | any): Promise<any> => {
        await dbconnection();
        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) {
          throw new Error("No user found, please sign up.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        const userWithoutPassword: any = user.toObject();
        delete userWithoutPassword.password;
        return userWithoutPassword;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.name = user.username;
        token.id = user._id || user.id;
        token.uid = user.uid;
        token.active = true;
        token.teams = user.teams;
        token.brawlStars = user.brawlStars;
      }

      await dbconnection();
      if (user && user._id) {
        const userActive = await User.findById(user._id);

        if (userActive) {
          userActive.isActive = true;
          await userActive.save();
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token.id) {
        session.user.id = token.id;
        session.user.uid = token.uid;
        session.user.name = token.name;
        session.user.active = token.active;
        session.user.teams = token.teams;
        session.user.brawlStars = token.brawlStars;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  events: {
    async signOut(message: any) {
      // This callback is called when the user session is ended (e.g., user logs out or browser/tab is closed)
      await dbconnection();
      const userFromDB = await User.findById(message.token.id);

      if (userFromDB) {
        userFromDB.isActive = false;
        await userFromDB.save();
      }
    },
  },
};

export default NextAuth(authOptions);
