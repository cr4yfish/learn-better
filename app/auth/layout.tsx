import { Button } from "@/components/utils/Button";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {  
    Navbar,   
    NavbarBrand,  
    NavbarContent,   
    NavbarItem
    } from "@nextui-org/navbar";
import Link from "next/link";

export default function Layout({children} : {children: React.ReactNode}) {


    return (
        <>
        <Navbar>
            <NavbarBrand>
                <span className="font-black text-primary">Nouv</span>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Link href="/auth/login"><Button variant="flat" color="secondary">Login</Button></Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        <div className="relative w-screen h-screen max-w-screen max-h-screen overflow-hidden overflow-x-hidden flex items-center justify-center">
            <ScrollShadow className="relative z-50 w-full h-full max-w-[500px] gap-4 overflow-y-auto pt-5 pb-20 px-6">
                
                {children}
                
            </ScrollShadow>

            <svg viewBox="0 0 200 200" className=" fill-fuchsia-400/30 absolute top-[75vh] scale-[300%] blur-3xl" xmlns="http://www.w3.org/2000/svg">
                <path fill="blue" opacity={.05} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(150 25)" />
                <path fill="inherit" d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(100 100)" />
            </svg>
        
        </div>


        </>

    )
}