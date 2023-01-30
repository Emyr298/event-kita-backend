import fb from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseParams = {
  type: process.env['FIREBASE_TYPE'],
  projectId: process.env['FIREBASE_PROJECT_ID'],
  privateKeyId: process.env['FIREBASE_PRIVATE_KEY_ID'],
  privateKey: process.env['FIREBASE_PRIVATE_KEY'],
  clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
  clientId: process.env['FIREBASE_CLIENT_ID'],
  authUri: process.env['FIREBASE_AUTH_URI'],
  tokenUri: process.env['FIREBASE_TOKEN_URI'],
  authProviderX509CertUrl: process.env['FIREBASE_AUTH_PROVIDER_X509_CERT_URL'],
  clientC509CertUrl: process.env['FIREBASE_CLIENT_X509_CERT_URL'],
};

export default fb.initializeApp({
  credential: fb.credential.cert(firebaseParams),
  databaseURL: 'event-kita-48292.firebaseio.com',
});
