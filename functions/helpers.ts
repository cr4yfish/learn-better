import { Streak } from "@/types/db";

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

export function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}



export function formatReadableDate(date: string) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const d = new Date(date);
    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export function getDayBefore(date: Date): Date {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    return previousDay;
}

/**
 * Returns fortnite of date
 * @param date | Date
 * @returns Date
 */
export function fortnite(date: Date): Date {
    const fortnite = new Date(date);
    fortnite.setDate(date.getDate() + 2);
    return fortnite;
}


// Fisher-Yates (Knuth) Shuffle algorithm
export function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getAnonkey(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
}

export function getSupabaseURL(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL as string;
}

export function getSupabaseStorageURL(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL as string;
}

export function streakToStreakDays(streak: Streak): number {
    const from = new Date(streak.from);
    const to = streak.to ? new Date(streak.to) : new Date(); // if to is null, use today -> streak is ongoing
    const diff = Math.abs(to.getTime() - from.getTime()) + 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const theme = {
    enableDarkMode: () => {
        document.documentElement.classList.add("dark");
    },
    disableDarkMode: () => {
        document.documentElement.classList.remove("dark");
    },
    setDarkMode: (value: boolean) => {
        if (value) {
            theme.enableDarkMode();
        } else {
            theme.disableDarkMode();
        }
    }
}

export function areArraysEqual(array1: string[], array2: string[]) {
    return array1.length === array2.length && array1.every((value) => array2.some((v) => v.toLowerCase() === value.toLowerCase()));
}

export const triggerVibration = (ms=200) => {
    if (navigator.vibrate) {
        navigator.vibrate(ms); // Vibrate for 200ms
    } else {
        console.warn('Vibration API not supported');
    }
}
