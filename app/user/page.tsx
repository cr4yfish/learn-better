"use server";


import { Badge } from "@nextui-org/badge";

import Navigation from "@/components/utils/Navigation";
import { getCurrentUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";
import { formatReadableDate } from "@/functions/helpers";
import { Chip } from "@nextui-org/chip";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import Settings from "@/components/user/Settings";

export default async function User() {;

    const session = await getCurrentUser();

    if(!session) {
        redirect("/auth");
    }

    return (
    <>
    <div className="flex flex-col gap-4 px-6 py-6 h-full min-h-full">

        <div className="relative flex items-center w-full overflow-hidden">

            <div className="flex flex-col gap-4 w-full">

                <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-lg font-bold">Hi, {session.profile?.username}</h2>
                            <Settings sessionState={session} />
                        </div>
                        
                        <div className="flex flex-col text-tiny dark:text-gray-300">
                            <span>{session.user?.email}</span>
                            <span>Joined {formatReadableDate(session.user?.created_at ?? "")}</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-8 mt-4 h-[48px]">
                        <div className="w-fit flex flex-col gap-1 h-full">
                            
                            <Badge 
                                size="lg" shape="rectangle" 
                                color="secondary" variant={"flat"}
                                content={<span>+ {session.courses.length}</span>}
                                classNames={{
                                    base: " min-w-fit h-[28px] pl-0",
                                    badge: "bg-transparent text-gray-400 translate-x-[25px] -translate-y-[0]",
                                }}
                            >
                                <Chip variant="light" color="secondary" className="p-0" classNames={{ base: "p-0", content: "p-0" }}>
                                    {session.settings.current_course.abbreviation}
                                </Chip>
                            </Badge>
                            <span className="text-tiny">Courses</span>
                        </div>

                        <div className="flex flex-col min-h-full gap-1 h-full">
                            <span className=" font-medium text-medium h-[28px]">5</span>
                            <span className="text-tiny">Following</span>
                        </div>

                        <div className="flex flex-col min-h-full gap-1 h-full">
                            <span className=" font-medium text-medium h-[28px]">7</span>
                            <span className="text-tiny">Followers</span>
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button isDisabled variant="flat" color="secondary">Add friends</Button>
                    <Button isDisabled isIconOnly variant="flat" color="secondary"><Icon filled>share</Icon></Button>
                </div>


                <div className="flex flex-col">
                    <h2 className=" text-medium font-medium ">Overview</h2>
                                
                    <div className="flex flex-row items-center flex-wrap gap-4">
                        
                        <div className="flex flex-row gap-1">
                            <div>
                                <Icon filled>mode_heat</Icon>
                            </div>
                            <div className="flex flex-col">
                                <span>{session.currentStreakDays}</span>
                            </div>
                        </div>

                                          
                        <div className="flex flex-row gap-1">
                            <div>
                                <Icon filled>hotel_class</Icon>
                            </div>
                            <div className="flex flex-col">
                                <span>{session.profile?.total_xp}</span>
                            </div>
                        </div>


                    </div>

                </div>
            
            </div>
            
        </div>



        <div className="flex flex-col">
            <h2 className="text-lg font-bold">Achievements</h2>
        </div>


    </div>
    <Navigation activeTitle="Profile" />
    </>

    )
}