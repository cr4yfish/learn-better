import { Card, CardHeader, CardBody } from "@nextui-org/card"

import { Course } from "@/types/db";

export default function CourseButton({ course, active, onPress } : { course: Course, active: boolean, onPress: () => void }) {
     
    return (
        <>
        <Card 
            isPressable
            onPress={onPress}
            className={` w-full min-h-full border border-default1 ${active ? 'border-primary' : 'bg-default'} text-white`}
        >
            <CardHeader className="font-bold">{course.abbreviation}</CardHeader>
            <CardBody>{course.description}</CardBody>
        </Card>
        </>
    )
}