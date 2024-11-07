"use client";

import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";

type Params = {
    userId: string;
}

export default function ShareProfileButton(params: Params) {


    return (
        <Button
            isIconOnly
            variant="flat"
            color="secondary"
            onClick={() => {
                if (navigator.share) {
                navigator.share({
                    title: 'Check out this page',
                    url: window.location.origin + '/user/' + params.userId,
                }).catch(console.error);
                } else {
                // Fallback for browsers that don't support the Web Share API
                alert('Sharing is not supported on this browser.');
                }
            }}
            >
            <Icon filled>share</Icon>
        </Button>
    )
}