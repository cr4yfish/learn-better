"use client";


import { Card, CardHeader, CardBody } from "@nextui-org/card";

import { Course_Section } from "@/types/db";

export default function CourseSectionBanner(
    { courseSection } : 
    { courseSection: Course_Section | null }) {

    return (
        courseSection &&
        <Card className="top-0 w-full max-w-[960px] z-10 bg-fuchsia-900/55 backdrop-blur">
            <CardHeader className=" font-bold pb-0">{courseSection.title}</CardHeader>
            <CardBody>{courseSection.description}</CardBody>
        </Card>
    );
}