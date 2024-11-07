"use client";


import { useEffect, useState } from "react"
import { motion } from "framer-motion";

import { Uppy } from "@uppy/core"
import { Dashboard, useUppyEvent } from "@uppy/react"
import Tus from "@uppy/tus";

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';



import { SessionState } from "@/types/auth";
import { getAnonkey, getSupabaseStorageURL } from "@/utils/functions/helpers";
import Icon from "./Icon";
import { Button } from "./Button";
import BlurModal from "./BlurModal";

export default function UppyFileUpload({ session, label, setFileNameCalback, isDisabled } : { session: SessionState | null, label?: string, setFileNameCalback?: (fileName: string) => void, isDisabled?: boolean }) {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [uppy] = useState<Uppy>(() => new Uppy());

    useUppyEvent(uppy, "file-added", (file) => {
        const metadata = {
            bucketName: "documents",
            objectName: encodeURIComponent(file.name?? "unnamed file"),
            contentType: file.type
        }
        file.meta = { ...file.meta, ...metadata};
    })

    useUppyEvent(uppy, "upload-success", async (file) => {
        if(!file?.name) {
            console.error("No file name");
            return;
        }
        setIsModalOpen(false);
        if(setFileNameCalback) setFileNameCalback(file.name);
    });

    useEffect(() => {
        if(session?.user?.id) {
            const tusInstance = uppy.getPlugin("Tus");
            if(tusInstance) uppy.removePlugin(tusInstance); // remove the plugin if it exists
            uppy.use(Tus, {
                endpoint: getSupabaseStorageURL(),
                headers: {
                    authorization: `Bearer ${session?.session?.access_token}`,
                    apikey: getAnonkey()
                }
            });
        }
    }, [session, uppy]);

    return (
        <>
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=""
        >
            <Button 
                isIconOnly={!label}
                color='primary' 
                size='md' 
                isDisabled={isDisabled}
                className='mr-2 text-primary-600 dark:text-primary' 
                variant="flat"
                onClick={() => setIsModalOpen(true)}
            >
                {label && <span>{label}</span>} 
                <Icon>upload</Icon>
            </Button>
        </motion.div>

        <BlurModal
            isOpen={isModalOpen}    
            updateOpen={setIsModalOpen} 
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: false
            }}  
            header="Upload Files"
            body={
                <div className=" w-full">
                    <Dashboard uppy={uppy} className="" />
                </div>
            }
        />

        </>
    )
}