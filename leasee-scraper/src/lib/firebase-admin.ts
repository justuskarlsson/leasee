import admin from "firebase-admin";

import serviceAccount from "../../secret/leasee-b5897-firebase-adminsdk-4k0y8-bf33179ad7.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any)
});


export const db = admin.firestore();