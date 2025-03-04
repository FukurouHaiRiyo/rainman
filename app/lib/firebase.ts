import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

import { FirebaseAPI_Key, FirebaseAuthDomain, FirebaseDatabaseUrl, FirebaseProjectID, FireaseStorageBucket, FirebaseMessagingSenderId, FirebaseAppId, FirebaseMeasurementId } from './env';

// Firebase configuration
const firebaseConfig = {
    apiKey: FirebaseAPI_Key,
    authDomain: FirebaseAuthDomain,
    databaseURL: FirebaseDatabaseUrl,
    projectId: FirebaseProjectID,
    storageBucket: FireaseStorageBucket,
    messagingSenderId: FirebaseMessagingSenderId,
    appId: FirebaseAppId,
    measurementId: FirebaseMeasurementId
};

// Initialize Firebase
const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;

export const auth = getAuth(firebase);
export const db = getDatabase(firebase);

export { firebase, FieldValue }
