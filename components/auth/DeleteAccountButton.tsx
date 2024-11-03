"use client";

import { deleteAccount } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

export default function DeleteAccountButton() {
    const { toast } = useToast();

    const handleDeleteAccount = async () => {

        try {
            const { data: { user } } = await deleteAccount();

            if(user?.id) {
                console.log("Account deleted");
            }

            redirect("/");
        } catch(e) {
            console.error(e);
            toast({
                title: "Error deleting account",
                description: "There was an error deleting your account. Please try again.",
                variant: "destructive"
            })
        }

    }

    return (
        <>
        <AlertDialog>

            <AlertDialogTrigger asChild>
                <Button  color="danger" startContent={<Icon filled>delete</Icon>} >
                    Delete Account
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        
        </AlertDialog>
        </>
    )
}