"use client";

import { Course, Topic } from "@/types/db"
import Level from "./Level"
import { getCourseTopics } from "@/functions/client/supabase"
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "@nextui-org/spinner";

const calculateOffsets = (numLevels: number, maxOffset: number) => {
    const offsets = [];
    let offset = 0;
    let direction = 1;
    const stepSize = 3;

    for (let i = 0; i < numLevels; i++) {
        offsets.push(offset);
        offset += stepSize * direction;
        if (offset > maxOffset || offset <= -(2*maxOffset)) {
            direction *= -1;
            offset += stepSize * direction; // Adjust offset after direction change
            // reduce offset of last one to make a curve
            offsets[i - 1] -= (stepSize/5);
        }
        if(Math.abs(offsets[i]) == Math.abs(offset)) {
            offset += stepSize;
        }
    }
    return offsets;
};


export default function LevelScroller({ currentCourse } : { currentCourse: Course }) {
    const [topics, setTopics] = useState<Topic[]>([])
    const [offsets, setOffsets] = useState<number[]>([])
    const [canLoadMore, setCanLoadMore] = useState(true)
    const [cursor, setCursor] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)


    const loadMore = async () => {
        if(isLoading || !currentCourse?.id) {
            console.log("Someone wanted to load more while loading or no course selected");
            return;
        }

        setIsLoading(true);
        console.log("Trying to load more");

        if(!currentCourse?.id) {
            console.log("cant load, no course selected");
            return
        }
        try {
            const limit = 20;
            const res = await getCourseTopics(currentCourse.id, cursor, limit)

            // filter out duplicates
            const filteredRes = res.filter((topic) => !topics.some((t) => t.id === topic.id))

            console.log("Filtered out ", res.length - filteredRes.length, " duplicates")

            // Safety check
            if(filteredRes.length < limit) { 
                setCanLoadMore(false) 
                console.log("No more topics to load")
            }
            if(filteredRes.length === 0) {
                setCanLoadMore(false)
                setIsLoading(false);
                console.log("No more topics to load")
                return
            }

            const calcOffsets = calculateOffsets(filteredRes.length, 4)
            setOffsets(calcOffsets)
            
            setTopics((prevState) => {
                return [...prevState, ...filteredRes]
            })
            setCursor(cursor + limit+1)

        } catch (error) {
            console.error("Error in Levelscroller with:", currentCourse, error)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setTopics([])
        setOffsets([])
        setCursor(0)
        setIsLoading(false)
        loadMore()
    }, [currentCourse])

    return (
        <InfiniteScroll 
            className="flex flex-col items-center gap-2 w-full h-full max-h-screen overflow-y-scroll  pb-80"
            pageStart={1}
            loadMore={async () => await loadMore()}
            hasMore={canLoadMore}
            loader={<Spinner key="spinner" />}
            key="infinite-scroll"
        >
            {topics.map((topic, index) => (
                <Level 
                    key={topic.id} 
                    topic={topic} 
                    active={topics[index - 1]?.completed || index === 0}
                    offset={offsets[index]}
                />
            ))}
        </InfiniteScroll>
    )
}