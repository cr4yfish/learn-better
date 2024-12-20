"use client";

import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/modal"
import React, { useEffect, useRef } from "react";
import { Noise, NoiseContent } from "react-noise";
import "react-noise/css";
import Icon from "./Icon";
import { Button } from "../utils/Button";

export default function BlurModal({
    settings, header, body, footer, isOpen, updateOpen
} : {
    settings: {
        hasHeader: boolean,
        hasBody: boolean,
        hasFooter: boolean,
        placement?: "center" | "auto" | "top" | "top-center" | "bottom" | "bottom-center" | undefined, 
        size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | undefined,
        isDismissable?: boolean,
        hideCloseButton?: boolean,
    },
    header?: React.ReactNode | React.ReactNode[],
    body?: React.ReactNode | React.ReactNode[],
    footer?: React.ReactNode | React.ReactNode[],
    isOpen: boolean,
    updateOpen: (isOpen: boolean) => void,
}) {
    const { isOpen: internalIsOpen, onOpen: internalOnOpen, onClose: internalOnClose, onOpenChange } = useDisclosure()
    const contentRef = useRef<HTMLDivElement>(null);

    if(settings.hasHeader && !header) {
        throw new Error("You enabled Header but provided no content for it.")
    }
    if(settings.hasBody && !body) {
        throw new Error("You enabled Body but provided no content for it.")
    }
    if(settings.hasFooter && !footer) {
        throw new Error("You enabled Footer but provided no content for it.")
    }

    useEffect(() => {
        if(isOpen) {
            internalOnOpen();
        } else {
            internalOnClose();
        }
    }, [isOpen, internalOnOpen, internalOnClose])

    return (
        <Modal
            isOpen={internalIsOpen}
            placement={settings.placement}
            size={settings.size}
            isDismissable={settings.isDismissable}
            isKeyboardDismissDisabled={settings.isDismissable}
            hideCloseButton={true}
            onClose={() => { internalOnClose(); updateOpen(false) }}
            onOpenChange={onOpenChange}
            backdrop="blur"
            className="max-h-screen overflow-y-auto"
            classNames={{
                base: " bg-content1/70 dark:bg-content1/50  dark:backdrop-blur-xl",
                body: "bg-transparent"
            }}
        >
            <ModalContent>
                <Noise opacity={100} className=" noise h-fit relative min-h-max" >
                    <NoiseContent className=" noise-content h-full justify-normal min-h-max ">
                        <div ref={contentRef} className="h-full min-h-max  flex flex-col overflow-visible">
                            {settings.hasHeader && 
                            <ModalHeader className="flex flex-row items-center justify-between ">
                                {header}
                                {!settings.hideCloseButton && <Button onClick={() => {internalOnClose(); updateOpen(false) }} variant="light" color="danger" isIconOnly><Icon filled>close</Icon></Button>}
                            </ModalHeader>
                            }
                            {settings.hasBody && <ModalBody className="relative overflow-hidden ">{body}</ModalBody>}
                            {settings.hasFooter && <ModalFooter className=" max-sm:pb-8 ">{footer}</ModalFooter>}
                        </div>
                    </NoiseContent>
                </Noise>
            </ModalContent>
        </Modal>
        
    )
}