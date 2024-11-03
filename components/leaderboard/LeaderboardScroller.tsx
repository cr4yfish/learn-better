"use client";

import { useState } from "react";
import { SessionState } from "@/types/auth";
import { Profile, Rank } from "@/types/db";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "@nextui-org/spinner";
import LeaderboardCard from "../user/LeaderBoardCard";
import { getProfilesInRank } from "@/utils/supabase/user";


type Props = {
    sessionState: SessionState,
    ranks: Rank[],
    nextRank: Rank,
    initProfilesInRank: Profile[]
}

const _limit = 20;

export default function LeaderboardScroller(props: Props) {

    const [profiles, setProfiles] = useState<Profile[]>(props.initProfilesInRank);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [cursor, setCursor] = useState<number>(props.initProfilesInRank.length);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLoadMore = async () => {
        if(isLoading) return;

        setIsLoading(true);

        const result = await getProfilesInRank({
            rankID: props.sessionState.profile?.rank?.id,
            offset: cursor,
            limit: 20
        })

        if(result.length === 0 || result.length < _limit) {
            setHasMore(false);
        }

        setProfiles([...profiles, ...result]);
        setCursor(cursor + _limit);


        setIsLoading(false);
    }

    return (
        <>
        <InfiniteScroll
            id="infiniteScroll"
            className="flex flex-col gap-2 overflow-x-hidden h-fit overflow-y-hidden"
            pageStart={1}
            loadMore={async () => handleLoadMore()}
            hasMore={hasMore}
            useWindow={false}
            threshold={50}
            loader={<Spinner key="spinner" />}
            key={"infinite-scroll"}
        >
            {profiles.map((profile, index) => (
                <LeaderboardCard 
                    key={index} 
                    profile={profile} 
                    sessionState={props.sessionState} 
                    position={index+1} 
                />
            ))}

        </InfiniteScroll>
        </>
    )
}