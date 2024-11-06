
import React, { useEffect } from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import { useAsyncList } from "@react-stately/data";

import { Course, Course_Section } from "@/types/db";
import { searchCourseSections } from "@/utils/supabase/courses";


export default function CourseSectionAutocomplete({ setCourseSection, course, description } : { course: Course | null, setCourseSection: (courseSection: Course_Section) => void, description?: string }) {
    
    const list = useAsyncList<Course_Section>({
        async load({filterText}) {
            if(course) {
                const res = await searchCourseSections(filterText || "", course);

                return {
                    items: res,
                }
            }
            return {
                items: [] as Course_Section[]
            }
            

        }
    })

    useEffect(() => {
        if(course && course.id !== "") {
            list.reload();
        }
    }, [course])


    return (
        <Autocomplete
            className="max-w-xs z-50"
            variant="bordered"
            label="Pick a Course Section"
            placeholder="Select a Course Section"
            description={description}
            isDisabled={!course || course.id === ""}
            isLoading={list.isLoading}
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            onSelectionChange={(key: React.Key | null) => {
                if(!key) return;
                setCourseSection(list.items.find((item) => item.id === key) as Course_Section);
            }}
            
        >
            {(item) => (
                <AutocompleteItem key={item.id} className="capitalize">
                    {item.title}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}