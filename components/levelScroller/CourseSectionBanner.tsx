
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Course_Section } from "@/types/db";
import { Separator } from "../ui/separator";

export default function CourseSectionBanner(
    { courseSection } : 
    { courseSection: Course_Section | null }) {

    return (
        courseSection &&
        <>
        <Popover 
        classNames={{
            content: "bg-transparent p-0"
        }}>
            <PopoverTrigger>
                <div className="flex flex-row items-center justify-center gap-6 w-full min-w-fit overflow-visible my-4">
                    <Separator className="w-[60px]" />
                    <span className=" w-full min-w-max flex justify-center items-center text-center text-gray-700 dark:text-gray-400">{courseSection.title}</span>
                    <Separator className="w-[60px]" />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Card>
                    <CardHeader>
                        <CardTitle>{courseSection.title}</CardTitle>
                        <CardDescription>{courseSection.description}</CardDescription>
                    </CardHeader>
                </Card>
            </PopoverContent>
        </Popover>
        </>
    );
}