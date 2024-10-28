import { formatReadableDate } from "@/functions/helpers";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";

import FollowButton from "@/components/utils/FollowButton";
import { Profile } from "@/types/db";
import { SessionState } from "@/types/auth";

export default  function ProfileCard({ profile, session } : { profile: Profile, session: SessionState }) {;

    return (
    <>
    <div className="flex flex-col gap-4 h-full min-h-full">

        <div className="relative flex items-center w-full overflow-hidden">

            <div className="flex flex-col gap-4 w-full">

                <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-lg font-bold">{profile?.username}</h2>
                        </div>
                        
                        <div className="flex flex-col text-tiny dark:text-gray-300">
                            <span>{profile.username}</span>
                            <span>Joined {formatReadableDate(profile.created_at ?? "")}</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-8 mt-4 h-[48px]">

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
                    {session?.user?.id && session.user.id !== profile.id && <FollowButton userId={session.user.id} otherUserId={profile.id} />}
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
                                <span>{profile.currentStreakDays}</span>
                            </div>
                        </div>

                                          
                        <div className="flex flex-row gap-1">
                            <div>
                                <Icon filled>hotel_class</Icon>
                            </div>
                            <div className="flex flex-col">
                                <span>{profile.total_xp}</span>
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
    </>

    )
}