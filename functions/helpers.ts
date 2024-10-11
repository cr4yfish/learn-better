import React from "react";

/**
 * Swap strings with Date objects in data
 * @param data | data[]
 * @returns data with Date object(s)
 */
export function fixDateFormat<T extends { created_at?: Date | string }>(data: T | T[]): T | T[] {
    // check if array or object
    if (Array.isArray(data)) {
        data.forEach((item) => {
            if (item.created_at) {
                item.created_at = new Date(item.created_at);
            }
        });
    } else {
        if (data.created_at) {
            data.created_at = new Date(data.created_at);
        }
    }
    return data;
}