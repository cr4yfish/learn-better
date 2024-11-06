"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input"
import { v4 as uuidv4 } from "uuid";

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

import { Button } from "@/components/utils/Button"
import Icon from "@/components/utils/Icon"
import { uploadTextObject } from "@/utils/supabase/storage";

export default function ScraperForm({ setFilenameCallback, isDisabled } : { setFilenameCallback: (filename: string) => void, isDisabled?: boolean }) {
    const [url, setUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");

    const checkValid = () => {
        if(url === "") {
            return false;
        }

        return true;
    }

    const handleStartScraper = async () => {
        setIsLoading(true);

        try {   
            setStatus("Starting scraper");
            const fetchResult = await fetch("/api/scrape", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            })

            const text = await fetchResult.text();

            const filename = uuidv4();

            // upload to supabase
            setStatus("Uploading document");
            const uploadResult = await uploadTextObject({
                path: filename,
                text: text,
                bucket: "documents"
            })

            setFilenameCallback(uploadResult);
            setStatus("Done");

        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    }

    return (
        <>
        <AlertDialog>

            <AlertDialogTrigger asChild>
                <Button 
                    color="secondary"
                    variant="flat"
                    endContent={<Icon filled>link</Icon>}
                    isDisabled={isDisabled}
                >
                    Upload URL
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Copy content from another source</AlertDialogTitle>
                    <AlertDialogDescription>
                        <form className="flex flex-col gap-2" >
                            <Input 
                                type="url"
                                label="URL"
                                isRequired
                                value={url}
                                onValueChange={(value) => setUrl(value)}
                                placeholder="Enter the URL of the content you want to copy"
                            />
                        </form>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>                    
                        <Button 
                            endContent={<Icon filled>cloud_download</Icon>} 
                            type="submit" 
                            onClick={handleStartScraper} 
                            isLoading={isLoading}
                            variant="shadow"
                            color="primary" 
                            isDisabled={!checkValid()}
                            fullWidth
                        >
                            {isLoading ? status : "Start Scraper"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>


        </AlertDialog>
      
        </>
    )
}