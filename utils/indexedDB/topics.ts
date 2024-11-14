"use client";

import { cache } from "react";

import { openDB, upgradeDB } from "./indexedDB";
import { Topic } from "@/types/db";


export const saveTopicsToLocal = async (topics: Topic[]): Promise<Topic[]> => {
    const db = await openDB();
    try {
        const transaction = db.transaction("topics", "readwrite")
        const store = transaction.objectStore("topics");
    
        topics.forEach((topic) => {
            // use put since we might be updating the topic
            const request = store.put(topic);
    
            request.onerror = function(event) {
                console.error(event);
            }
        });
    
        return topics;
    } catch (error) {
        const err = error as Error;
        if(err.name === "NotFoundError") {
            await upgradeDB();

            // repeat the process
            const res = saveTopicsToLocal(topics);
            return res;
        }
        return [];
    }
}

export const getTopicsLocal = cache(async (courseId: string): Promise<Topic[]> => {
    return new Promise<Topic[]>(async (resolve, reject) => {
        const db = await openDB();
        const transaction = db.transaction("topics", "readonly");
        const store = transaction.objectStore("topics");

        const request = store.getAll();

        request.onsuccess = function(this) {
            const topics = this.result as Topic[];
            
            // filter by courseId
            resolve(topics.filter((t) => t.course.id === courseId));
        }

        request.onerror = function(event) {
            console.error(event);
            reject([]);
        }
    });
})