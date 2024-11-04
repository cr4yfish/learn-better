"use client";

import { useEffect, useState } from "react";

import CourseCategoryAutocomplete from "./CourseCategoryAutocomplete";
import { Course_Category } from "@/types/db";
import { Input } from "@nextui-org/input";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";

type Props = {
    category?: Course_Category,
    setCategory: (category: Course_Category) => void,
}

export default function EditCourseCategory(props: Props) {
    const [category, setCategory] = useState<Course_Category | undefined>(props.category);

    useEffect(() => {
        if(props.category?.id !== category?.id)
            setCategory(props.category);
    }, [category, setCategory, props.category])

    return (
        <>  
        { category?.title && category.title.length > 0 ?
            <div className="flex gap-1 items-center">
                <Input value={category.title} size="lg" label="Course Category" />
                <Button 
                    isIconOnly variant="light" 
                    color="warning" size="lg"
                    onClick={() => {
                        setCategory(undefined);
                        props.setCategory({} as Course_Category);
                    }}
                >
                    <Icon>refresh</Icon>
                </Button>
            </div>
            :
            <CourseCategoryAutocomplete setCategory={props.setCategory} />
        }
            
        </>
    )
}