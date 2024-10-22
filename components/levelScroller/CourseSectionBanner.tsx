"use client";


import { Card, CardHeader, CardBody } from "@nextui-org/card";

import { Course_Section } from "@/types/db";

export default function CourseSectionBanner(
    { courseSection } : 
    { courseSection: Course_Section | null }) {

    return (
        courseSection &&
        <Card className="top-0 w-full max-w-[960px] z-10 bg-transparent bg-gradient-to-tr from-fuchsia-800/20 to-fuchsia-500/15  backdrop-blur">
            <CardHeader className=" font-bold pb-0">{courseSection.title}</CardHeader>
            <CardBody>{courseSection.description}</CardBody>
        </Card>
    );
}