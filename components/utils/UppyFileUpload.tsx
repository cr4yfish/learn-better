"use client";


import { useEffect, useState } from "react"
import { motion } from "framer-motion";

import { Uppy } from "@uppy/core"
import { Dashboard, useUppyEvent } from "@uppy/react"
import Tus from "@uppy/tus";

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

import {Modal, ModalContent, ModalHeader, ModalBody, useDisclosure} from "@nextui-org/modal";


import { SessionState } from "@/types/auth";
import { getAnonkey, getSupabaseStorageURL } from "@/functions/supabase/auth";
import Icon from "./Icon";
import { Button } from "./Button";

export default function UppyFileUpload({ session, label, setFileNameCalback } : { session: SessionState | null, label?: string, setFileNameCalback?: (fileName: string) => void }) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [uppy] = useState<Uppy>(() => new Uppy());

    useUppyEvent(uppy, "file-added", (file) => {
        const metadata = {
            bucketName: "documents",
            objectName: encodeURIComponent(file.name?? "unnamed file"),
            contentType: file.type
        }
        file.meta = { ...file.meta, ...metadata};
    })

    useUppyEvent(uppy, "upload-success", async (file, res) => {
        console.log(`Upload successful: ${JSON.stringify(file), JSON.stringify(res)}`);
        if(!file?.name) {
            console.error("No file name");
            return;
        }
        onClose();
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
                className='mr-2 text-primary-600 dark:text-primary' 
                variant="flat"
                onClick={onOpen}
            >
                {label && <span>{label}</span>} 
                <Icon>upload</Icon>
            </Button>
        </motion.div>
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                <ModalHeader>Upload Files</ModalHeader>
                <ModalBody>
                    <Dashboard uppy={uppy} className="" />
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}