"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
 
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import { User_XP } from "@/types/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function XPChart({ xp } : { xp: User_XP[] }) {

    const chartConfig = {

    } satisfies ChartConfig

    return (
        <>
        <Card>
            <CardHeader>
                <CardDescription>Your XP history</CardDescription>
                <CardTitle>XP</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className=" max-h-[200px] max-w-[400px] w-full " color="black" >
                    <AreaChart accessibilityLayer data={xp} className=" stroke-fuchsia-200/50 dark:stroke-fuchsia-950/50 ">
                        <CartesianGrid vertical={false} />
                        <Area 
                            dataKey={"xp"} 
                            type={"natural"}
                            className="fill-primary stroke-primary "
                        />
                        <XAxis dataKey="created_date" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>

        </>
    )
}