"use sever";

import { cache } from "react";
import { createClient as getClient } from "./server/server";


export const getXP = cache(async () => {
    const { data, error } = await getClient()
        .from("user_xp")
        .select("*")
    if(error) {  throw error; }
    return data;
})