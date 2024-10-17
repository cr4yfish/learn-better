"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import InfiniteScroll from "react-infinite-scroller";
import Link from "next/link";

import { Course, Course_Section, Topic, User_Course } from "@/types/db"
import Level from "./Level"
import { getCourseTopics } from "@/functions/client/supabase"
import Icon from "@/components/Icon";
import { Button } from "@/components/Button";

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

export default function LevelScroller({ currentUserCourse } : { currentUserCourse: User_Course }) {
    const [topics, setTopics] = useState<Topic[]>([])
    const [currentCourseSection, setCurrentCourseSection] = useState<Course_Section | null>(null)
    const [offsets, setOffsets] = useState<number[]>([])
    const [canLoadMore, setCanLoadMore] = useState(true)
    const [cursor, setCursor] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const levelRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScrollOutOfView = (entry: IntersectionObserverEntry) => {
            if (!entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                const topic = topics.find((t) => t.id === target.dataset.id);
                setCurrentCourseSection(topic?.course_section ?? null);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(handleScrollOutOfView);
        });

        const currentLevelRefs = levelRefs.current;
        currentLevelRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentLevelRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [topics]);
    
    useEffect(() => {
        
        // Reset stuff when course changes
        setTopics([]);
        setOffsets([]);
        setCursor(0);
        setCanLoadMore(true);
        setIsAdmin(currentUserCourse.is_collaborator || currentUserCourse.is_admin || currentUserCourse.is_moderator);


    }, [currentUserCourse]);


    const handleLoadMore = async () => {
        if(isLoading || !canLoadMore) { return; } // this line can be called very often, so leave it short
        setIsLoading(true);

        const result = await loadMoreTopics({
            cursor, currentCourse: currentUserCourse.course, topics, limit: 20
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
            if(!currentCourseSection && topics.length > 0) {
                setCurrentCourseSection(topics[0].course_section ?? null);
            }
        }
        setIsLoading(false);
    }

    const CourseSectionBanner = ({ courseSection } : { courseSection: Course_Section | null}) => (
        courseSection &&
        <Card className=" top-0 w-full max-w-[960px] z-10 bg-fuchsia-900/55 backdrop-blur">
            <CardHeader className=" font-bold pb-0">{courseSection.title}</CardHeader>
            <CardBody>{courseSection.description}</CardBody>
        </Card>
    );

    return (
    <>
        <div className=" w-full h-fit absolute flex justify-center items-center px-6">
            <CourseSectionBanner courseSection={currentCourseSection} />
        </div>
        
        <InfiniteScroll 
            className="flex flex-col items-center gap-2 w-full h-full max-h-screen overflow-y-scroll pb-80 pt-32"
            pageStart={1}
            loadMore={() => canLoadMore && handleLoadMore()}
            hasMore={canLoadMore}
            loader={<Spinner key="spinner" />}
            key="infinite-scroll"
        >
            {topics.map((topic, index) => (
                <div key={topic.id} ref={(el) => { levelRefs.current[index] = el; }} data-id={topic.id}>
                    <Level 
                        topic={topic} 
                        active={topic.completed || topics[index - 1]?.completed || index === 0 || false}
                        offset={offsets[index]}
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
                <span>You reached the end.</span>
                {isAdmin && (
                    <Link href={"/level/new"}>
                        <Button 
                            color="primary" 
                            startContent={<Icon color="fuchsia-950" filled>add</Icon>} 
                        >
                            Add a new level
                        </Button>
                    </Link>   
                )}
                </div>
            )}
            
        </InfiniteScroll>
    </>
    )
}