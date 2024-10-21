
import React, { useEffect } from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import { useAsyncList } from "@react-stately/data";

import { Course, Course_Section } from "@/types/db";
import { searchCourseSections } from "@/functions/supabase/courses";


export default function CourseSectionAutocomplete({ setCourseSection, course } : { course: Course, setCourseSection: (courseSection: Course_Section) => void }) {

    useEffect(() => {
        if(course && course.id !== "") {
            list.reload();
        }
    }, [course])

    const list = useAsyncList<Course_Section>({
        async load({filterText}) {
            const res = await searchCourseSections(filterText || "", course);

            return {
                items: res,
            }
        }
    })

    return (
        <Autocomplete
            className="max-w-xs"
            variant="bordered"
            label="Pick a Course Section"
            placeholder="Select a Course Section"
            isDisabled={!course || course.id === ""}
            required
            isRequired
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