import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const getSessionData = async (
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"]
) => await unstable_getServerSession(req, res, authOptions);
