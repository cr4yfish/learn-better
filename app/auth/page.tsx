"use server";

import Link from "next/link";

import { Button } from "@/components/utils/Button";

export default async function Auth() {
    
    return (
        <>
        <div className="z-10 px-4 py-6 h-screen flex flex-col gap-4 items-center justify-center pt-[15vh] pb-[33vh]">
            <h1 className="text-4xl font-bold text-center">Welcome to Nouv!</h1>
            
            <Link href="/auth/login"><Button color="primary">Get started</Button></Link>
        </div>

        <span className="absolute w-screen h-screen top-[66%] right-[50%]  fill-black ">
            <svg viewBox="0 0 200 200" className=" fill-fuchsia-400/30 scale-[300%]" xmlns="http://www.w3.org/2000/svg">
                <path fill="inherit" d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(100 100)" />
            </svg>
        </span>
        </>
    )
}