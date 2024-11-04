
import React from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import { useAsyncList } from "@react-stately/data";

import { Course, Course_Category } from "@/types/db";
import { searchCourseCategories } from "@/utils/supabase/courses";

type Props = {
    setCategory: (category: Course_Category) => void,
}

export default function CourseCategoryAutocomplete(props: Props) {

    const list = useAsyncList<Course>({
        async load({filterText}) {
            const res = await searchCourseCategories(filterText || "");

            return {
                items: res,
            }
        }
    })

    return (
        <Autocomplete
            className="max-w-xs"
            variant="bordered"
            label="Pick Category"
            placeholder="Select Category"
            required
            isRequired
            isLoading={list.isLoading}
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            onSelectionChange={(key: React.Key | null) => {
                if(!key) return;
                props.setCategory(list.items.find((item) => item.id === key) as Course_Category);
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