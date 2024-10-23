"use server";

import Navigation from "@/components/utils/Navigation";
import CommunityMain from "@/components/community/CommunityMain";

export default async function Community() {


    return (
        <>
        <CommunityMain />
        <Navigation activeTitle="Community" />
        </>
    )
}