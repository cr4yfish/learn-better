
"use client";

import {  useState } from "react";

import { Button } from "@nextui-org/button"
import { Modal, ModalContent, ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal"
import { Input } from "@nextui-org/input"
import { Checkbox } from "@nextui-org/checkbox"


import { SessionState } from "@/types/auth";
import { userSignUp, userLogin, getProfile, getSession, userLogOut } from "@/functions/supabase/auth";

export default function LoginButton({ sessionState, setSessionState } : { sessionState: SessionState, setSessionState: React.Dispatch<React.SetStateAction<SessionState>> }) {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

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

                if(res && res.profile && res.authResponse.data) {
                    setSessionState({
                        ...sessionState,
                        user: res.authResponse.data.user ?? undefined, 
                        profile: res.profile, 
                        session: res.authResponse.data.session, 
                        isLoggedIn: true,
                        settings: res.settings
                    });
                    onClose();
                }

            } else {

                const res = await userLogin(data.email as string, data.password as string);

                if(res.success) {
                    
                    const profile = await getProfile(res.user.id as string);
                    const { data: sessionData } = await getSession();

                    if(profile && sessionData.session) {
                        setSessionState({...sessionState, user: res.user, profile: profile, session: sessionData.session, isLoggedIn: true});
                    }

                    onClose();
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
        
        setSessionState({...sessionState, user: undefined, profile: undefined, session: null, isLoggedIn: false});

        setIsLoading(false);
    }

    return (
        <>
        {!sessionState.isLoggedIn ? <Button color="primary" variant="shadow" onClick={onOpen}>Login</Button>
        : <Button color="danger" variant="shadow" onClick={handleLogout}>Logout</Button>     }


        <Modal size="lg" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{isSignUp ? "Sign up" : "Log in" }</ModalHeader>
                <ModalBody>
                    <form id="loginForm" onSubmit={handleSubmit} className="flex flex-col gap-2">
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
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" variant="light" onClick={() => setIsSignUp(!isSignUp)} isDisabled={isLoading}>
                        {isSignUp ? "Log in instead" : "Sign up instead"}
                    </Button>
                    <Button type="submit" color="primary" form="loginForm" isLoading={isLoading}>
                        {isSignUp ? "Sign up" : "Log in"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}