"use client";

export const openDB = async (newVersion?: number) => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("localDB", newVersion || 1);

        request.onsuccess = function(this) {
            resolve(this.result);
        }

        request.onerror = (event) => {
            reject(event);
        }

        request.onupgradeneeded = function (this) {
            const db = this.result;
            db.createObjectStore("courses", { keyPath: "id" });
            db.createObjectStore("topics", { keyPath: "id" });
        }

    });
}

export const upgradeDB = async (): Promise<IDBDatabase> => {
    const oldDB = await openDB(1);
    return await openDB(oldDB.version + 1);
}

export const clearDB = async (): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(["courses", "topics"], "readwrite");

    transaction.objectStore("courses").clear();
    transaction.objectStore("topics").clear();
}