import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

import { Course } from "@/types/db";

export default function CourseButton({ course, active, onPress } : { course: Course | undefined, active: boolean, onPress: () => void }) {
     
    return (
        <>
        <Card 
            onClick={onPress}
            className={` 
                w-full min-w-fit min-h-full border border-default1 
                text-white 
                ${active ? 'border-primary text-fuchsia-50 bg-fuchsia-500 dark:bg-fuchsia-500/75' : 'bg-gray-400 dark:bg-default/10'} `}
        >
            <CardHeader className="font-bold pb-0 text-inherit">
                <CardTitle>{course?.abbreviation}</CardTitle>
                <CardDescription>{course?.description}</CardDescription>
            </CardHeader>
            <CardContent className=" pt-1">
            </CardContent>
        </Card>
        </>
    )
}