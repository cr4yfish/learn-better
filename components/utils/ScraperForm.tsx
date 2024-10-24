"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input"

import { Button } from "@/components/utils/Button"
import Icon from "@/components/utils/Icon"
import BlurModal from "./BlurModal";
import { uploadTextObject } from "@/utils/supabase/storage";

export default function ScraperForm({ setFilenameCallback } : { setFilenameCallback: (filename: string) => void }) {
    const [url, setUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

            // upload to supabase
            setStatus("Uploading document");
            const uploadResult = await uploadTextObject({
                path: "scraped.html",
                text: text,
                bucket: "documents"
            })

            setFilenameCallback(uploadResult);
            setStatus("Done");
            setIsModalOpen(false);

        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    }

    return (
        <>
        <Button 
            color="secondary"
            variant="flat"
            endContent={<Icon filled>link</Icon>}
            onClick={() => setIsModalOpen(true)}
        >
            Upload source from URL
        </Button>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true
            }}
            header={
                <><h2 className="font-bold text-lg" >Copy content from another source</h2></>
            }
            body={
                <>
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
                </>
            }
            footer={
                <>
                <div className="flex flex-row gap-2">
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
                </div>
                </>
            }
        />
        </>
    )
}