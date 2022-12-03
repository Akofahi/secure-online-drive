import { collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore, storage } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const KEY = 'user-file';
const userFileCollection = collection(firestore, KEY);

export async function getUser(id: string) {
    const querySnapshot = await getDoc(doc(firestore, KEY, id));
    const user = querySnapshot.data();
    return { ...user, id };
}

export async function uploadFile(userId: string, file: File) {
    const usersStorageRef = storageRef(storage, `files/${userId}`);

    const {
        metadata: { name, fullPath },
        ref,
    } = await uploadBytes(usersStorageRef, file);

    const downloadURL = await getDownloadURL(ref);

    return {
        name,
        fullPath,
        src: downloadURL,
    };
}

export async function addUserFile(data: {user: string; file: string;}) {
    const ref = doc(userFileCollection);
    const res = await setDoc(ref, data);
    return res;
}

export async function deleteUserFile(id: string) {
    const ref = doc(userFileCollection, id);
    const res = await deleteDoc(ref);
    return res;
}


