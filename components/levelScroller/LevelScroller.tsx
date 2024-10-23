"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import InfiniteScroll from "react-infinite-scroller";
import Link from "next/link";

import { Course, Course_Section, Topic, User_Course } from "@/types/db"
import Level from "./Level"
import Icon from "@/components/utils/Icon";
import CourseSectionBanner from "./CourseSectionBanner";
import { Button } from "@/components/utils/Button";
import { getCourseTopics } from "@/utils/supabase/topics";

import { useCurrentCourse } from "@/hooks/SharedCourse";
import { getUserCourse } from "@/utils/supabase/courses";

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

async function loadMoreTopics({
    cursor, currentCourse, topics, limit=20
} : {
    currentCourse: Course, topics: Topic[], cursor: number, limit?: number,
}): Promise<{ data: { cursor: number, topics: Topic[], offsets: number[], canLoadMore: boolean } } | { error: string }>  {
    let canLoadMore = true;

    if (!currentCourse?.id) {  return { error: "No course selected" }; }

    try {
        const res = await getCourseTopics(currentCourse.id, cursor, limit);

        // filter out duplicates
        const filteredRes = res.filter((topic) => !topics.some((t) => t.id === topic.id));

        // Safety checks
        if (filteredRes.length < limit || filteredRes.length === 0) {  canLoadMore = false;  }
        if (filteredRes.length === 0) { return { error: "No more topics to load" }; }

        const calcOffsets = calculateOffsets(filteredRes.length, 4);

        return {
            data :{
                cursor: cursor + limit + 1,
                topics: [...topics, ...filteredRes],
                offsets: calcOffsets,
                canLoadMore: canLoadMore,
            }
        }

    } catch (error) {
        console.error(error);
        return { error: "An error occurred while fetching topics" };
    }
}

async function courseToUserCourse(course: Course): Promise<User_Course> {
    const res = await getUserCourse(course.id);
    return res;
}

export default function LevelScroller({ initUserCourse, initTopics } : { initUserCourse: User_Course, initTopics: Topic[] }) {

    const [topics, setTopics] = useState<Topic[]>(initTopics)
    const [isAdmin, setIsAdmin] = useState(initUserCourse.is_admin || initUserCourse.is_collaborator || initUserCourse.is_moderator)
    const [cursor, setCursor] = useState<number>(initTopics.length)

    const [currentCourseSection, setCurrentCourseSection] = useState<Course_Section | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [offsets, setOffsets] = useState<number[]>([])
    const [canLoadMore, setCanLoadMore] = useState(true)
    
    const [isLoading, setIsLoading] = useState(false)

    const { currentCourse } = useCurrentCourse(); // For switching courses

    useEffect(() => {
        // scroll to topic with #next id
        setTimeout(() => {
            const parent = document.getElementById("infiniteScroll");
            const target = document.getElementById("isNextLevel");
            if(parent && target) {
                parent.scroll({
                    top: target.offsetTop - parent.offsetTop,
                    behavior: "smooth"
                });
            }
        }, 500);
        
    }, [topics])

    // Reset stuff if currentCourse changes
    useEffect(() => {

        // If currentCourse is null, dont do anything -> this should never happen
        if((currentCourse == null )) { return; }

        // If the current course is the init course and we have topics, dont do anything
        // -> this means we are still on first load and have the initTopics
        if((currentCourse.id == initUserCourse.course.id ) && (topics.length > 0)) {
            return;
        }

        courseToUserCourse(currentCourse).then((res) => {
            setTopics([]);
            setOffsets([]);
            setCursor(0);
            setCanLoadMore(true);
            setIsAdmin((res?.is_collaborator || res?.is_admin || res?.is_moderator) ?? false);
        });
        
    }, [currentCourse,initUserCourse?.course.id])


    const handleLoadMore = async () => {
        if(isLoading || !canLoadMore || !currentCourse) { return; } // this line can be called very often, so leave it short
        setIsLoading(true);

        const result = await loadMoreTopics({
            cursor, currentCourse: currentCourse, topics, limit: 20
        });

        if ('error' in result) {
            console.error(result.error);
            setCanLoadMore(false);
        } else {
            const { cursor, topics, offsets, canLoadMore } = result.data;
            setCursor(cursor);
            setTopics(topics);
            setOffsets(offsets);
            setCanLoadMore(canLoadMore);
            if(currentCourseSection == null && topics.length > 0) {
                setCurrentCourseSection(topics[0].course_section ?? null);
            }
        }
        setIsLoading(false);
    }

    return (
    <>
        
        <InfiniteScroll 
            id="infiniteScroll"
            className="flex flex-col items-center gap-4 w-full h-full max-h-screen overflow-y-scroll pb-80"
            pageStart={1}
            loadMore={async () => canLoadMore && await handleLoadMore()}
            hasMore={canLoadMore}
            initialLoad={!((currentCourse?.id == initUserCourse.course.id) && topics.length > 0)}
            loader={<Spinner key="spinner" />}
            key="infinite-scroll"
        >
                    {topics.map((topic, index) => (
                        <div key={topic.id} >
                            {(index == 0 || topic.course_section.id !== topics[index-1]?.course_section.id) && (
                                <div className=" w-full px-4 mb-4 mt-8"><CourseSectionBanner courseSection={topic.course_section} /></div>
                            )}
                            <Level 
                                topic={topic} 
                                active={topic.completed || topics[index - 1]?.completed || index === 0 || false}
                                isNext={(topics[index-1]?.completed && !topic.completed) ?? false}
                                offset={0}
                                isAdmin={isAdmin}
                            />
                        </div>            
                    ))}

            {!canLoadMore && topics.length === 0 && (
                <>
                <span>No topics found.</span>
                {isAdmin && (
                    <>
                    <Link 
                        href={"/level/new"}>
                            <Button 
                                color="primary" 
                                startContent={<Icon filled>add</Icon>} 
                            >
                                Add new level
                            </Button>
                    </Link> 
                    </>
                )}
                </>
                
            )}
            {!canLoadMore && topics.length > 0 && (
                <div className="flex flex-col gap-2">
                    {isAdmin && (
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <Link href={"/level/new"}>
                                <Button 
                                    color="primary" 
                                    startContent={<Icon color="fuchsia-950" filled>add</Icon>} 
                                >
                                    Add a new level
                                </Button>
                            </Link>
                            <span className="text-tiny">or</span>
                            <Link href={"/level/new/ai"}>
                                <Button
                                    color="primary"
                                    startContent={<Icon color="fuchsia-950" filled>auto_awesome</Icon>}
                                >
                                    Create levels with AI
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
            
        </InfiniteScroll>
    </>
    )
}