"use server";

import Battles from "@/components/training/Battles";
import TrainButton from "@/components/training/TrainButton";
import WeeklyGoal from "@/components/training/WeeklyGoal";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import Navigation from "@/components/utils/Navigation"
import { getSession } from "@/utils/supabase/auth";
import { getBattles } from "@/utils/supabase/battles";
import { getWeakQuestions } from "@/utils/supabase/questions";
import { getTimeSpentByUser, getWeeklyGoalByUser } from "@/utils/supabase/weeklyGoals";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { redirect } from "next/navigation";


export default async function Training() {

    const { data: { session }} = await getSession();

    if(!session) {
        redirect('/auth');
    }

    const weakQuestions = await getWeakQuestions();
    const weeklyGoal = await getWeeklyGoalByUser(session.user.id);
    const secondsSpentByUser = await getTimeSpentByUser(session.user.id);
    const battles = await getBattles(session.user.id);
    
    return (
        <>
        <ScrollShadow className="pb-20">
            <div className=" px-4 py-6 flex flex-col gap-4 overflow-y-visible min-h-fit">
                <h1 className="text-2xl font-bold">Training</h1>
                <Card>
                    <CardHeader>
                        <CardDescription className="flex flex-row items-center gap-1">
                            <Icon downscale>exercise</Icon>
                            Improve your weaknesses
                        </CardDescription>
                        <CardTitle>You&apos;ve got {weakQuestions.length} weak questions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row items-center gap-2">
                        <TrainButton weakQuestions={weakQuestions} />
                        <Button startContent={<Icon filled>list</Icon>} size="lg" className="w-[150px]" color="secondary" variant="flat">View</Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardDescription className="flex flex-row items-center gap-1">
                            <Icon downscale>calendar_month</Icon>
                            Weekly goal
                        </CardDescription>
                        <CardTitle>Your weekly goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WeeklyGoal goal={weeklyGoal} userId={session.user.id} minutesSpentInWeek={secondsSpentByUser/60} />
                    </CardContent>
                </Card>

                <Battles battles={battles} userId={session.user.id} />

                <Card>
                    <CardHeader>
                        <CardDescription className="flex flex-row items-center gap-1">
                            <Icon downscale>group</Icon>
                            Exercise with friends
                        </CardDescription>
                        <CardTitle>Your Quests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <span className=" text-gray-700 dark:text-gray-300 ">No ongoing Quests</span>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            startContent={<Icon filled>group</Icon>} 
                            fullWidth size="lg" color="secondary" isDisabled variant="flat">Start a Quest</Button>
                    </CardFooter>
                </Card>

            </div>
        </ScrollShadow>

        <Navigation activeTitle="Training" />
        
        </>
    )
}