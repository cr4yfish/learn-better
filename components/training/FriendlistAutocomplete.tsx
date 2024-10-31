
import React, { useEffect } from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import { useAsyncList } from "@react-stately/data";

import { Followed_Profile, Profile } from "@/types/db";
import { searchFriends } from "@/utils/supabase/user";


export default function FriendlistAutocomplete({ setFriend, userId } : { userId: string, setFriend: (friend: Followed_Profile) => void }) {
    
    const list = useAsyncList<Followed_Profile>({
        async load({filterText}) {
            const res = await searchFriends(filterText || "");
            
            return {
                items: res,
            }

        }
    })

    useEffect(() => {
        if(userId) {
            list.reload();
        }
    }, [userId])


    return (
        <Autocomplete
            className="max-w-xs"
            variant="bordered"
            label="Pick a Foe"
            isDisabled={!userId}
            required
            isRequired
            isLoading={list.isLoading}
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            onSelectionChange={(key: React.Key | null) => {
                if(!key) return;
                setFriend(list.items.find((item) => item.id === key) as Profile);
            }}
            
        >
            {(item) => (
                <AutocompleteItem key={item.id} className="capitalize">
                    {item.username}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}