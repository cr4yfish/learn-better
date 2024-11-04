
import React from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import { useAsyncList } from "@react-stately/data";

import { Course, Course_Tag } from "@/types/db";
import { searchCourseTags } from "@/utils/supabase/courses";


export default function CourseTagsAutocomplete({ setTags } : { setTags: (tags: Course_Tag[]) => void }) {

    const list = useAsyncList<Course>({
        async load({filterText}) {
            const res = await searchCourseTags(filterText || "");

            return {
                items: res,
            }
        }
    })

    return (
        <Autocomplete
            className="max-w-xs"
            variant="bordered"
            label="Pick Tags"
            placeholder="Select Tags"
            required
            isRequired
            isLoading={list.isLoading}
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            onSelectionChange={(key: React.Key | null) => {
                if(!key) return;
                setTags(list.items.find((item) => item.id === key) as Course_Tag[]);
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