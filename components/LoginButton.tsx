
"use client";

import { Button } from "@nextui-org/button"
import { Modal, ModalContent, ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal"
import { Input } from "@nextui-org/input"
import { Checkbox } from "@nextui-org/checkbox"

import { userLogin, getSession, userLogOut, getProfile } from "@/functions/client/supabase";
import {  useState } from "react";
import { SessionState } from "@/types/auth";

export default function LoginButton({ sessionState, setSessionState } : { sessionState: SessionState, setSessionState: React.Dispatch<React.SetStateAction<SessionState>> }) {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log(data);

        const res = await userLogin(data.email as string, data.password as string);

        console.log(res);
        if(res.success) {
            
            const profile = await getProfile(res.user.id as string);
            const { data: sessionData } = await getSession();

            if(profile && sessionData.session) {
                setSessionState({...sessionState, user: res.user, profile: profile, session: sessionData.session, isLoggedIn: true});
            }

            onClose();
        }
        setIsLoading(false);
    }

    const handleLogout = async () => {
        setIsLoading(true);

        const res = await userLogOut();

        console.log(res);
        
        setSessionState({...sessionState, user: undefined, profile: undefined, session: null, isLoggedIn: false});

        setIsLoading(false);
    }

    return (
        <>
        {!sessionState.isLoggedIn ? <Button color="primary" variant="shadow" onPress={onOpen}>Login</Button>
        : <Button color="danger" variant="shadow" onPress={handleLogout}>Logout</Button>     }


        <Modal className="dark" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
                <ModalBody>
                    <form id="loginForm" onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <Input label="Email" type="email" name="email" />
                        <Input label="Password" type="password" name="password" />
                        <Checkbox name="rememberMe">Remember me</Checkbox>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose} isDisabled={isLoading}>
                        Close
                    </Button>
                    <Button type="submit" color="primary" form="loginForm" isLoading={isLoading}>
                        Login
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
        </>
    )
}