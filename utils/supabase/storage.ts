/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileObject } from "@supabase/storage-js";

import { getClient } from "./client";


/**
 * Download object either by providing filename and path or the full path
 * @param params 
 */
export async function downloadObject(params: { filename: string, path: string, bucketName: string }): Promise<Blob>;
export async function downloadObject(params: { fullPath: string, bucketName: string }): Promise<Blob>;

/**
 * Download object either by providing filename and path or the full path
 * @param params 
 * @returns 
 */
export async function downloadObject(params: { filename?: string, path?: string, fullPath?: string, bucketName: string }): Promise<Blob> {
    let fullPath = params.fullPath;
    if (!fullPath && params.filename && params.path) {
        fullPath = params.path + params.filename;
    }
    if (!fullPath) {
        throw new Error("Invalid parameters");
    }
    const { data, error } = await getClient().storage.from(params.bucketName).download(fullPath);
    if(error) { throw error; }
    return data;
}

export async function deleteObject(params: { filename: string, path: string, bucketName: string }): Promise<void>;
export async function deleteObject(params: { fullPath: string, bucketName: string }): Promise<void>;

export async function deleteObject(params: { filename?: string, path?: string, fullPath?: string, bucketName: string }): Promise<void> {
    let fullPath = params.fullPath;
    if (!fullPath && params.filename) {
        fullPath = params.path + params.filename;
    }
    if (!fullPath) {
        throw new Error("Invalid parameters");
    }
    const { error } = await getClient().storage.from(params.bucketName).remove([fullPath]);
    if(error) { throw error; }
}

/**
 * Gets a signed URL for an object valid for 60 minutes
 * @param params 
 */
export async function getObjectSignedURL(params: { filename: string, path: string }): Promise<string>;
export async function getObjectSignedURL(params: { fullPath: string }): Promise<string>;

export async function getObjectSignedURL(params: { filename?: string, path?: string, fullPath?: string }): Promise<string> {
    let fullPath = params.fullPath;
    if (!fullPath && params.filename && params.path) {
        fullPath = params.path + params.filename;
    }
    if (!fullPath) {
        throw new Error("Invalid parameters");
    }
    const res = await getClient().storage.from("objects").createSignedUrl(fullPath, 60);

    if(res.error) {
        throw res.error;
    }

    return res.data.signedUrl;
}

/**
 * Wrapper for : A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function,
 *  you can construct the public URL by concatenating the bucket URL with the path to the asset. This function does not verify if the bucket is public. 
 * If a public URL is created for a bucket which is not public, you will not be able to download the asset.
 * @param params 
 */
export async function getObjectPublicURL(params: { filename: string, path: string, bucket: string }): Promise<string>;
export async function getObjectPublicURL(params: { fullPath: string, bucket: string }): Promise<string>;
export async function getObjectPublicURL(params: { id: string, bucket: string }): Promise<string>;

export async function getObjectPublicURL(params: { filename?: string, path?: string, fullPath?: string, id?: string, bucket: string }): Promise<string> {
    if(!params.bucket) {
        throw new Error("Bucket is required");
    }
    
    let fullPath = params.fullPath;
    if (!fullPath && params.filename && params.path) {
        fullPath = params.path + params.filename;
    }
    if (fullPath) {
        return (getClient().storage.from(params.bucket).getPublicUrl(fullPath).data.publicUrl);
    }
    if(params.id) {
        try {
            const fileObject = await getObjectInfoFromID(params.id, params.bucket);
            return getClient().storage.from(params.bucket).getPublicUrl(fileObject.name).data.publicUrl;
        } catch (error) {
            throw error;
        }
    }
    
    throw new Error("Invalid parameters");
}

export async function getObjectInfoFromID(id: string, bucket: string): Promise<FileObject> {
    const res = await getClient().storage.from(bucket).list();

    if(res.error) {
        throw res.error;
    }
    const fileObject = res.data.find((obj: FileObject) => obj.id === id);

    if(!fileObject) {
        throw new Error("File object not found");
    }

    return fileObject;
}