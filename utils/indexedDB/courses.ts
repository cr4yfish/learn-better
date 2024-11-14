"use client";

import { Course } from "@/types/db";
import { cache } from "react";

import { openDB } from "./indexedDB";

export const saveCourseToLocal = async (course: Course) => {
    const db = await openDB();
    
    const transaction = db.transaction("courses", "readwrite")
    const store = transaction.objectStore("courses");

    const request = store.put(course);

    request.onerror = function(event) {
        console.error(event);
    }

    return request;
}

export const getLocalCourses = cache(async () => {
    const db = await openDB();
    const transaction = db.transaction("courses", "readonly");
    const store = transaction.objectStore("courses");

    const request = store.getAll();

    request.onerror = function(event) {
        console.error(event);
    }

    return request;
})