import { ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { getStorage, }  from 'firebase-admin/storage';
import firebaseConfig from './zephyrcode-firebase-adminsdk-9fxps-ad336a51bf.json'


initializeApp({
    credential: cert(firebaseConfig as ServiceAccount),
    storageBucket: 'gs://zephyrcode.appspot.com'
  });
  
export const bucket = getStorage().bucket();

