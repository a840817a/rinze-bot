import {cert, initializeApp} from "firebase-admin/app";
import {getStorage} from "firebase-admin/storage";

export function init() {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
}

export function storage() {
    return getStorage().bucket(process.env.CLOUD_STORAGE_BUCKET);
}
