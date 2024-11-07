

"use client";

import { Button } from "@nextui-org/button";
import Icon from "../ui/Icon";


type Params = {
    courseId: string;
    showLabel?: boolean;
}

export default function ShareCourseButton(params: Params) {


    return (
        <Button
            isIconOnly={!params.showLabel}
            variant="flat"
            color="secondary"
            onClick={() => {
                if (navigator.share) {
                navigator.share({
                    title: 'Check out this page',
                    url: window.location.origin + '/course/' + params.courseId,
                }).catch(console.error);
                } else {
                // Fallback for browsers that don't support the Web Share API
                alert('Sharing is not supported on this browser.');
                }
            }}
            >
            <Icon filled>share</Icon>
            {params.showLabel && <span>Share Course</span>}
        </Button>
    )
}