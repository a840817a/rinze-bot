import admin from "firebase-admin";

export function init() {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
}

export function storage() {
    return admin.storage().bucket(process.env.CLOUD_STORAGE_BUCKET);
}
