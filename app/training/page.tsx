"use server";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import Navigation from "@/components/utils/Navigation"
import { getWeakQuestions } from "@/utils/supabase/questions";


export default async function Training() {

    const weakQuestions = await getWeakQuestions();
    
    return (
        <>
        <div className=" px-4 py-6 flex flex-col gap-4">
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
                    <Button startContent={<Icon filled>exercise</Icon>} fullWidth size="lg" color="primary" variant="shadow">Train</Button>
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
                    <div className="flex flex-row justify-evenly items-center w-full">
                        <Button isIconOnly variant="flat"><Icon>remove</Icon></Button>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">25</span>
                            <span className="text-tiny text-gray-700 dark:text-gray-300">Minutes/Day</span>
                        </div>
                        <Button isIconOnly variant="flat"><Icon>add</Icon></Button>
                    </div>
                </CardContent>
            </Card>

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
                    <Button startContent={<Icon filled>group</Icon>} fullWidth size="lg" color="primary" variant="shadow">Start a Quest</Button>
                </CardFooter>
            </Card>

            

        </div>
        
        <Navigation activeTitle="Training" />
        </>
    )
}