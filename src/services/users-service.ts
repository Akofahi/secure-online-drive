import { collection, doc, getDoc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore, storage } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject, getBlob } from 'firebase/storage';
import { useCollectionData } from 'react-firebase-hooks/firestore';
export const KEY = 'user-file';
const userFileCollection = collection(firestore, KEY);

export async function getUserFiles(userId: string) {
    const querySnapshot = await getDocs(query(userFileCollection, where('userId', '==', userId)));
    const users = querySnapshot.docs.map(x => ({
        ...(<any>x.data()),
        id: x.id,
    }));
    return users;
}

export async function getFileBlob(fullPath: string) {
    const ref = storageRef(storage, fullPath);
    const blob = getBlob(ref);
    return blob;
}

export async function uploadFile(userId: string, file: Blob, fileName: string) {
    const usersStorageRef = storageRef(storage, `files/${fileName}`);

    console.log('uploading file', file);
    
    const {
        metadata: { name, fullPath },
        ref,
    } = await uploadBytes(usersStorageRef, file);

    const downloadURL = await getDownloadURL(ref);

    return {
        name: fileName,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        fullPath,
        src: downloadURL,
    };
}

export async function addUserFile(data: {
    userId: string; file: {
        name: string;
        size: number;
        type: string;
        uploadDate: string;
        fullPath: string;
        src: string;
    };
}) {
    const ref = doc(userFileCollection);
    const res = await setDoc(ref, data);
    return res;
}

export async function removeUserFile(id: string, fileName: string) {
    const ref = doc(userFileCollection, id);
    const usersStorageRef = storageRef(storage, `files/${fileName}`);
    await deleteObject(usersStorageRef);
    const res = await deleteDoc(ref);

    return res;
}

export async function deleteUserFile(id: string) {
    const ref = doc(userFileCollection, id);
    const res = await deleteDoc(ref);
    return res;
}


