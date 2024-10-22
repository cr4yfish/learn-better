"use client";

import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/modal"
import React, { useEffect, useRef } from "react";
import { Noise, NoiseContent } from "react-noise";
import "react-noise/css";

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
            isDismissable={settings.isDismissable || true}
            isKeyboardDismissDisabled={settings.isDismissable || false}
            hideCloseButton={settings.hideCloseButton || false}
            onClose={() => { internalOnClose(); updateOpen(false) }}
            onOpenChange={onOpenChange}
            backdrop="blur"
            classNames={{
                base: "bg-content1/50 backdrop-blur-xl",
                body: "bg-transparent"
            }}
        >
            <ModalContent>
                <Noise opacity={0} className="w-full noise h-fit relative min-h-max" >
                    <NoiseContent className="w-full noise-content h-full justify-normal min-h-max ">
                        <div ref={contentRef} className="h-full min-h-max w-full flex flex-col overflow-visible">
                            {settings.hasHeader && <ModalHeader>{header}</ModalHeader>}
                            {settings.hasBody && <ModalBody>{body}</ModalBody>}
                            {settings.hasFooter && <ModalFooter className=" max-sm:pb-8 ">{footer}</ModalFooter>}
                        </div>
                    </NoiseContent>
                </Noise>
            </ModalContent>
        </Modal>
        
    )
}