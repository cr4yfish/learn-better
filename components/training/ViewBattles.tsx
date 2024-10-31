"use client";

import { useState } from "react";

import { Battle } from "@/types/db";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import BattleCard from "./BattleCard";

export default function ViewBattles({ battles, userId } : { battles: Battle[], userId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <Button onClick={() => setIsModalOpen(true)} size="lg" variant="flat" className="px-8" startContent={<Icon>list</Icon>}>View</Button>
        
        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "full"
            }}

            header={<>Your past Battles</>}

            body={
                <>
                {battles.map((battle) => (
                    <BattleCard key={battle.id} battle={battle} userId={userId} />
                ))}
                </>
            }

            footer={
                <Button size="lg" variant="flat" onClick={() => setIsModalOpen(false)}>Close</Button>
            }
        />
        </>
    )
}