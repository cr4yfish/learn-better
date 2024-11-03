"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import InfiniteScroll from "react-infinite-scroller";

import { Course, Course_Section, Topic, User_Course } from "@/types/db"
import Level from "./Level"
import CourseSectionBanner from "./CourseSectionBanner";
import { getCourseTopics } from "@/utils/supabase/topics";

import { useCurrentCourse } from "@/hooks/SharedCourse";
import { getUserCourse } from "@/utils/supabase/courses";
import AddContentModal from "./AddContentModal";

/**
 * 
 * @param prevOffset 
 * @param maxOffset % of screen width
 * @param stepSize 
 * @returns 
 */
const getNextOffset = (currentIndex: number, maxOffset: number, stepSize = 1): { nextOffset: number } => {;
    const maxLevelsPerDirection = Math.ceil(maxOffset / stepSize);

    let nextOffset = 0;
    let goRight = true;

    // get next direction
    const numDirectionChange = Math.floor(currentIndex / maxLevelsPerDirection);
    goRight = numDirectionChange % 2 === 0;

    const numInSegment = currentIndex % maxLevelsPerDirection;

    // get next offset
    if(goRight) {
        nextOffset = numInSegment
    } else {
        nextOffset = -numInSegment + maxLevelsPerDirection - 2;
    } 

    nextOffset -= 2

    return { nextOffset };
};

async function loadMoreTopics({
    cursor, currentCourse, topics, limit=20
} : {
    currentCourse: Course, topics: Topic[], cursor: number, limit?: number,
}): Promise<{ data: { cursor: number, topics: Topic[], canLoadMore: boolean } } | { error: string }>  {
    let canLoadMore = true;

    if (!currentCourse?.id) {  return { error: "No course selected" }; }

    try {
        const res = await getCourseTopics(currentCourse.id, cursor, limit);

        // filter out duplicates
        const filteredRes = res.filter((topic) => !topics.some((t) => t.id === topic.id));

        // Safety checks
        if (filteredRes.length < limit || filteredRes.length === 0) {  canLoadMore = false;  }
        if (filteredRes.length === 0) { return { error: "No more topics to load" }; }

        return {
            data :{
                cursor: cursor + limit + 1,
                topics: [...topics, ...filteredRes],
                canLoadMore: canLoadMore,
            }
        }

    } catch (error) {
        console.error(error);
        return { error: "An error occurred while fetching topics" };
    }
}

async function courseToUserCourse(course: Course, userId: string): Promise<User_Course> {
    const res = await getUserCourse(course.id, userId);
    return res;
}

export default function LevelScroller({ initUserCourse, initTopics, userId } : { initUserCourse: User_Course, initTopics: Topic[], userId: string }) {

    const [topics, setTopics] = useState<Topic[]>(initTopics)
    const [isAdmin, setIsAdmin] = useState(initUserCourse.is_admin || initUserCourse.is_collaborator || initUserCourse.is_moderator)
    const [cursor, setCursor] = useState<number>(initTopics.length)

    const [currentCourseSection, setCurrentCourseSection] = useState<Course_Section | null>(null)
    const [canLoadMore, setCanLoadMore] = useState(true)
    
    const [isLoading, setIsLoading] = useState(false)

    const { currentCourse, setCurrentCourse } = useCurrentCourse(); // For switching courses

    /*const scrollToNext = () => {
        const parent = document.getElementById("scrollparent");
        const target = document.getElementById("isNextLevel");
        if(parent && target) {
            parent.scroll({
                top: target.offsetTop - parent.offsetTop,
                behavior: "smooth"
            });
        }
    }*/

    // Reset stuff if currentCourse changes
    useEffect(() => {

        // If currentCourse is null, dont do anything -> this should never happen
        if((currentCourse == null )) { return; }

        // If the current course is the init course and we have topics, dont do anything
        // -> this means we are still on first load and have the initTopics
        if((currentCourse.id == initUserCourse.course.id ) && (topics.length > 0)) {
            setIsAdmin(initUserCourse.is_admin || initUserCourse.is_collaborator || initUserCourse.is_moderator)
            setCurrentCourse(initUserCourse.course);
            return;
        }

        courseToUserCourse(currentCourse, userId).then((res) => {
            setTopics([]);
            setCursor(0);
            setCanLoadMore(true);
            setIsAdmin((res?.is_collaborator || res?.is_admin || res?.is_moderator) ?? false);
        });
        
    }, [currentCourse,initUserCourse?.course.id])


    const handleLoadMore = async () => {
        if(isLoading || !canLoadMore || (!currentCourse && !initUserCourse.course)) { return; } // this line can be called very often, so leave it short
        setIsLoading(true);

        const result = await loadMoreTopics({
            cursor, currentCourse: currentCourse || initUserCourse.course, topics, limit: 20
        });

        if ('error' in result) {
            console.error(result.error);
            setCanLoadMore(false);
        } else {
            const { cursor, topics, canLoadMore } = result.data;
            setCursor(cursor);
            setTopics(topics);
            setCanLoadMore(canLoadMore);
            if(currentCourseSection == null && topics.length > 0) {
                setCurrentCourseSection(topics[0].course_section ?? null);
            }
        }
        setIsLoading(false);
    }

    const checkInitialLoad = () => {
        const result = !((currentCourse?.id == initUserCourse.course.id) && topics.length > 0)
        return result;
    }

    const checkIsNext = (topic: Topic, index: number) => {
        const isNext = (topics[index-1]?.completed && !topic.completed) ?? false;

        if(isNext) {
            //scrollToNext();
        }

        return isNext;
    }

    const handleGetOffset = (index: number): number => {
        if(index == 0) { return -2; }
        const { nextOffset } =  getNextOffset(index, 5);
        return nextOffset;
    }

    return (
    <>
        <InfiniteScroll 
            id="infiniteScroll"
            className="flex flex-col items-center gap-4 overflow-x-hidden overflow-y-hidden"
            pageStart={1}
            loadMore={async () => await handleLoadMore()}
            hasMore={canLoadMore}
            initialLoad={checkInitialLoad()}
            useWindow={false}
            threshold={50}
            loader={<Spinner key="spinner" />}
            key="infinite-scroll"
        >
                    {topics.map((topic, index) => (
                        <div key={topic.id} >
                            {(index == 0 || topic.course_section.id !== topics[index-1]?.course_section.id) && (
                                <CourseSectionBanner courseSection={topic.course_section} />
                            )}
                            <Level 
                                topic={topic} 
                                active={topic.completed || topics[index - 1]?.completed || index === 0 || false}
                                isNext={checkIsNext(topic, index)}
                                offset={handleGetOffset(index)}
                                isAdmin={isAdmin}
                            />
                        </div>            
                    ))}

            {!canLoadMore && topics.length === 0 && (
                <span>No topics found.</span>
            )}
            {!canLoadMore && topics.length >= 0 && (
                <div className="flex flex-col gap-2">
                    {isAdmin && (
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <AddContentModal 
                                course={currentCourse || initUserCourse.course}
                            />

                        </div>
                    )}
                </div>
            )}
            
        </InfiniteScroll>
    </>
    )
}