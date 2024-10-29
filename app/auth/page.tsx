"use server";

import Link from "next/link";


import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";

export default async function Auth() {

    return (
        <div className="flex flex-col gap-6 h-fit min-h-fit pt-5">
            <div className="flex flex-col items-center">
                <h1 className="font-black text-4xl">Welcome to <span className=" text-primary">Nouv</span></h1>
                <p>The next gen education platform</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
                <Link href="/auth/signup"><Button color="primary" variant="shadow" fullWidth>Get started</Button></Link>
                <Link href="/auth/login"><Button color="secondary" variant="flat">Login</Button></Link>
            </div>
            
            <Separator className="my-4 opacity-50"  />

            <div className="flex flex-col gap-1 items-center">
                <h2 className="font-bold text-lg">Need some convincing?</h2>
                <div className=" w-full flex flex-row gap-2 justify-center items-center">
                    <p className="text-sm">Here are some cool features</p>
                    <Icon filled color="primary" downscale>arrow_downward</Icon>
                </div> 
            </div>

            <Card className=" w-full min-h-fit">
                <CardHeader>
                    <CardDescription className="flex flex-row gap-1 items-center">
                        <Icon downscale >raven</Icon>
                        You are Duolingo now
                    </CardDescription>
                    <CardTitle>Learn anything you want</CardTitle>
                    
                </CardHeader>
                <CardContent>
                    <ul>
                        <li>Create and share Courses</li>
                        <li>Join courses others have made</li>
                    </ul>
                </CardContent>
            </Card>


            <Card className=" w-full min-h-fit">
                <CardHeader>
                    <CardDescription className="flex flex-row gap-1 items-center">
                        <Icon downscale >schedule</Icon>
                        Learn in record time
                    </CardDescription>
                    <CardTitle>No time? No Problem</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <span>Learn anywhere with our mobile-first design</span>
                    <span>Create Content with ease using our AI generator</span>
                </CardContent>
            </Card>

            <Card className=" w-full min-h-fit">
                <CardHeader>
                    <CardDescription className="flex flex-row gap-1 items-center">
                        <Icon downscale>public</Icon>
                        100% Open Source
                    </CardDescription>
                    <CardTitle>For the people, by the people</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Our platform is 100% open source, meaning you can contribute to it&apos;s development</p>
                </CardContent>
                <CardFooter>
                    <Link href="https://github.com/cr4yfish/learn-better">
                        <Button color="secondary" variant="flat" startContent={<Icon>link</Icon>}>Github</Button>
                    </Link>
                </CardFooter>
            </Card>

        </div>
    )
}