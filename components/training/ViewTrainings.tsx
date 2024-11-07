"use client";

import { useState } from "react";

import { Training } from "@/types/db";
import { Button } from "../utils/Button";
import Icon from "@/components/ui/Icon";
import BlurModal from "../ui/BlurModal";
import TrainingCard from "./TrainingCard";
import InfiniteScroll from "react-infinite-scroller";
import { getTrainings } from "@/utils/supabase/trainings";
import { Spinner } from "@nextui-org/spinner";

const _limit = 20;

export default function ViewTrainings() {
    
    // infinite scroll
    const [cursor, setCursor] = useState<number>(0);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLoadMore = async () => {
        if(isLoading) return;

        setIsLoading(true);

        const result = await getTrainings({ from: cursor, limit: _limit });

        if(result.length === 0) {
            setIsLoading(false);
            setCanLoadMore(false);
            return;
        }

        if(result.length < _limit) {
            setCanLoadMore(false);
        }

        setTrainings([...trainings, ...result]);
        setCursor(cursor + _limit);

        setIsLoading(false);

    }

    return (
        <>
        <Button 
            startContent={<Icon filled>list</Icon>} 
            size="lg" 
            className="w-[150px]" 
            onClick={() => setIsModalOpen(true)} 
            variant="flat"
        >
            View
        </Button>
        
        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "full"
            }}
            header={<h1 className="text-2xl font-bold">Trainings</h1>}
            body={
                <>
                <InfiniteScroll 
                    loadMore={async () => await handleLoadMore()}
                    hasMore={canLoadMore}
                    pageStart={1}
                    loader={<Spinner key="spinner" />}
                    className="flex flex-col gap-4 h-fit"
                >
                    {trainings.map((training, i) => (
                        <TrainingCard key={i} training={training} />
                    ))}
                </InfiniteScroll>
                </>
            }
            footer={
                <>

                </>
            }
        />
        </>
    )
}