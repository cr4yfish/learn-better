"use client";

import { Input } from "@nextui-org/input";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/utils/Button";
import { useToast } from "@/hooks/use-toast";

import { signup, login } from "@/app/auth/actions";

import React from "react";
import Icon from "../utils/Icon";

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? true : undefined;
}

function validatePassword(password: string) {
    return (password.length >= 8 && password.length < 72) ? true : undefined;
}

export default function SignupCard({ isSignUp } : { isSignUp: boolean }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [viewPassword, setViewPassword] = React.useState(false);

    const [form, setForm] = React.useState({
        username: "",
        email: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        console.log(e.currentTarget)


        if(isSignUp) {
            const signUpResponse = await signup(form);

            if(signUpResponse?.hasAuthError) {
                toast({
                    title:"Error Signing up",
                    description: signUpResponse.authError,
                    variant: "destructive",
                })
                setIsLoading(false);
            }
    
            if(signUpResponse?.hasProgresError) {
                toast({
                    title:"Error Signing up",
                    description: signUpResponse.postgresError,
                    variant: "destructive",
                })
                setIsLoading(false);
            }
    
        } else {
            const loginResponse = await login(form);
    
            if(loginResponse?.hasAuthError) {
                toast({
                    title:"Error Logging in",
                    description: loginResponse.authError,
                    variant: "destructive",
                })
                setIsLoading(false);
            }
            
        }

        
    }

    return (
        <>
        <form id="loginForm" className="w-full" onSubmit={handleSubmit} >
            <Card>
                <CardHeader className="text-lg font-bold">
                    <CardTitle className="text-2xl font-bold">
                        {isSignUp ? "Create an Account" : "Login"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 relative z-50">
                    {isSignUp &&
                        <Input 
                            name="username" type="text" 
                            form="loginForm" description="This will be your display name"
                            label="Username" isRequired 
                            value={form.username} onValueChange={(value) => setForm({...form, username: value})}
                        />
                    }
                    <Input 
                        name="email" type="email"
                        form="loginForm" description={isSignUp ? "Only you can see this." : ""}
                        label="Email" isRequired isInvalid={!validateEmail(form.email) && form.email.length > 3} errorMessage="Please enter a valid email"
                        value={form.email} onValueChange={(value) => setForm({...form, email: value})}
                    />
                    <Input 
                        name="password" type={viewPassword ? "text" : "password"}
                        form="loginForm" endContent={<Button variant="light" onClick={() => setViewPassword(!viewPassword)} isIconOnly><Icon>{viewPassword ? "visibility" : "visibility_off"}</Icon></Button>}
                        label="Password" isRequired isInvalid={!validatePassword(form.password) && form.password.length > 0} errorMessage="Password must be between 8 and 72 characters"
                        value={form.password} onValueChange={(value) => setForm({...form, password: value})}
                    />
                </CardContent>
                <CardFooter>
                    <Button 
                        fullWidth color="primary" 
                        type="submit" form="loginForm" 
                        isLoading={isLoading}
                    >
                        {isSignUp ? "Sign up" : "Login"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
        </>
    )
}