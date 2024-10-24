
"use client";

import {  useState } from "react";

import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { Checkbox } from "@nextui-org/checkbox"


import { SessionState } from "@/types/auth";
import { userSignUp, userLogin, getSession, userLogOut } from "@/utils/supabase/auth";
import BlurModal from "../utils/BlurModal";
import { getProfileById } from "@/utils/supabase/user";

export default function LoginButton(
    { sessionState, setSessionState, isRedirecting=false } : 
    { sessionState?: SessionState, setSessionState?: React.Dispatch<React.SetStateAction<SessionState>>, isRedirecting?: boolean }) 
    {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
     
        try {
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            if(data.email === "" || data.password === "" || (isSignUp && data.username === "")) {
                alert("Please fill in all fields");
                return;
            }
            
            setIsLoading(true);

            if(isSignUp) {

                const res = await userSignUp(data.email as string, data.password as string, data.username as string);

                if(res && res.profile && res.authResponse.data && setSessionState && sessionState) {
                    setSessionState({
                        ...sessionState,
                        user: res.authResponse.data.user ?? undefined, 
                        profile: res.profile, 
                        session: res.authResponse.data.session, 
                        isLoggedIn: true,
                        settings: res.settings
                    });
                    if(isRedirecting) {
                        window.location.href = "/";
                    }
                    //setIsModalOpen(false); Why close?
                }

            } else {

                const res = await userLogin(data.email as string, data.password as string);

                if(res.success) {
                    
                    const profile = await getProfileById(res.user.id as string);
                    const { data: sessionData } = await getSession();

                    if(profile && sessionData.session && setSessionState && sessionState) {
                        setSessionState({...sessionState, user: res.user, profile: profile, session: sessionData.session, isLoggedIn: true});
                    }
                    if(isRedirecting) {
                        window.location.href = "/";
                    }
                    setIsModalOpen(true);
                }
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid login credentials")) {
                alert("Invalid login credentials");
            }
        }
        setIsLoading(false);
    
    }

    const handleLogout = async () => {
        setIsLoading(true);

        const res = await userLogOut();
        if(res) {
            console.error("LoginButtonError:",res);
        }
        
        if(setSessionState && sessionState) {
            setSessionState({...sessionState, user: undefined, profile: undefined, session: null, isLoggedIn: false});
        }
        

        setIsLoading(false);
    }

    return (
        <>
        {!sessionState?.isLoggedIn ? <Button color="primary" variant="shadow" onClick={() => setIsModalOpen(true)}>Login</Button>
        : <Button color="danger" variant="shadow" onClick={handleLogout}>Logout</Button>     }

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "lg"
            }}
            header={<div className="flex flex-col gap-1">{isSignUp ? "Sign up" : "Log in" }</div>}
            body={<form id="loginForm" onSubmit={handleSubmit} className="flex flex-col gap-2">
                <Input label="Email" type="email" name="email" />
                <Input label="Password" type="password" name="password" />

                {isSignUp ? (
                    <>
                        <Input label="Username" name="username" />
                        <Checkbox name="rememberMe">Remember me (doesnt do anything yet)</Checkbox>
                    </>
                ) :
                    <>
                        <Checkbox name="rememberMe">Remember me (doesnt do anything yet)</Checkbox>
                    </>
                }
            </form>}
            footer={
                <>
                    <Button color="warning" variant="light" onClick={() => setIsSignUp(!isSignUp)} isDisabled={isLoading}>
                        {isSignUp ? "Log in instead" : "Sign up instead"}
                    </Button>
                    <Button type="submit" color="primary" form="loginForm" isLoading={isLoading}>
                        {isSignUp ? "Sign up" : "Log in"}
                    </Button>
                </>
            }
        />
        </>
    )
}