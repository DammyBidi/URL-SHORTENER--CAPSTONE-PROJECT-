// firebase.spec.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { isSupported } from 'firebase/analytics';
import { auth, db, app } from '../utils/firebase'; // Import functions to be tested

// Mock Firebase initialization functions
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({ mockApp: true } as unknown as FirebaseApp)), // Mock FirebaseApp object
}));
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({ mockAuth: true } as unknown as Auth)), // Mock Auth object
}));
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({ mockFirestore: true } as unknown as Firestore)), // Mock Firestore object
}));
jest.mock('firebase/analytics', () => ({
    isSupported: jest.fn(() => Promise.resolve(true)), // Mock isSupported function
}));

describe('Firebase initialization', () => {
it('initializes Firebase app', () => {
    expect(initializeApp).toHaveBeenCalledWith(expect.any(Object));
});

it('exports initialized Firebase app', () => {
    expect((app as any).mockApp).toBeTruthy();
});

it('exports initialized Auth object', () => {
    expect((auth as any).mockAuth).toBeTruthy();
});

it('exports initialized Firestore object', () => {
    expect((db as any).mockFirestore).toBeTruthy();
});

it('checks Firebase Analytics support', async () => {
    await expect(isSupported).toHaveBeenCalled();
});
});
