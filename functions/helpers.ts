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

export function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}