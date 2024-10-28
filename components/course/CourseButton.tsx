import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip";

import { Course } from "@/types/db";

export default function CourseButton({ course, active, onPress } : { course: Course | undefined, active: boolean, onPress: () => void }) {
     
    return (
        <>
        <Card 
            isPressable
            onPress={onPress}
            className={` w-full min-h-full border border-default1 text-white ${active ? 'border-primary text-fuchsia-800' : 'bg-default'} `}
        >
            <CardHeader className="font-bold pb-0 text-inherit">{course?.abbreviation}</CardHeader>
            <CardBody className=" pt-1 text-inherit">
                {course?.institution && <Chip size="sm" className=" text-inherit" >{course?.institution?.abbreviation}</Chip>}
                <span className=" text-inherit">{course?.description}</span>
            </CardBody>
        </Card>
        </>
    )
}