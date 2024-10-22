import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip";

import { Course } from "@/types/db";

export default function CourseButton({ course, active, onPress } : { course: Course | undefined, active: boolean, onPress: () => void }) {
     
    return (
        <>
        <Card 
            isPressable
            onPress={onPress}
            className={` w-full min-h-full border border-default1 ${active ? 'border-primary' : 'bg-default'} text-white`}
        >
            <CardHeader className="font-bold pb-0">{course?.abbreviation}</CardHeader>
            <CardBody className=" pt-1">
                {course?.institution && <Chip size="sm" >{course?.institution?.abbreviation}</Chip>}
                <span>{course?.description}</span>
            </CardBody>
        </Card>
        </>
    )
}