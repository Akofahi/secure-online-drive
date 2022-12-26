import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { saveAs } from 'file-saver';
import { useResponsive } from '../../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeaderFooterLayout from '../../layouts/header-footer-layout';
import { Dropzone } from '@mantine/dropzone';
import { Group, useMantineTheme, Text, Table, ActionIcon, Input } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconDownload, IconTrash, IconPassword } from '@tabler/icons';
import { addUserFile, deleteUserFile, getFileBlob, getUserFiles, removeUserFile, uploadFile } from '../../services/users-service';
import { showNotification } from '@mantine/notifications';
import CryptoJS from 'crypto-js';
import e from 'express';

function FilesList() {
    const [user, userIsLoading, userError] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const [key,setKey ] = useState("");
    const [files, setFiles] = useState([]);
    const { responsive } = useResponsive();
    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login')
        } else {
            updateList()
        }
    }, [user])


    return (
        <HeaderFooterLayout>

            {/* upload files */}
            <Dropzone
                loading={isLoading}
                onDrop={(files) => handleDrop(files)}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={20 * 1024 ** 2}>

                <Group position="center" spacing="xl" style={{ minHeight: 80, pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IconUpload
                            size={50}
                            stroke={1.5}
                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size={50}
                            stroke={1.5}
                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto size={50} stroke={1.5} />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag file here or click to select one
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            File size should not exceed 20mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>

            {/* files list */}
            <div style={{display:"flex",justifyContent:"center" ,alignItems:"center",marginTop:"100px" ,flexDirection:"column"}}>  <label htmlFor="Input" >Encryption key</label><Input sx={{  maxWidth: "300px" ,}}  type="password" onChange={e => keychangehandler(e.target.value)} /></div>
            
            <Table sx={{ marginTop: 100 }}>
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        files?.map((x) => (
                            <tr key={x.id}>
                                <td style={{ textAlign: 'start' }}>{x.file.name}</td>
                                <td style={{ textAlign: 'start' }}>{x.file.size}</td>
                                <td style={{ textAlign: 'start' }}>{x.file.uploadDate}</td>
                                <td style={{ textAlign: 'start' }}>
                                    <div style={{ display: 'flex' }}>
                                
                                        <ActionIcon onClick={() => downloadFile(x.file)}>
                                            <IconDownload size={18} />
                                        </ActionIcon>
                                        <ActionIcon onClick={() => deleteUserFile(x.id, x.file.name)}>
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

        </HeaderFooterLayout>
    );


    async function handleDrop(files: File[] | File) {

        setIsLoading(true);

        try {
            if (!Array.isArray(files)) files = [files];

            const promises = files.map(file => encryptAndUpload(file));

            const uploadedFiles = await Promise.all(promises);

            console.log(uploadedFiles);

            const filesPromises = uploadedFiles.map(file => addUserFile({ userId: user.uid, file: file as any }))

            await Promise.all(filesPromises);

        } catch (error) {
            showNotification({
                color: 'red',
                message: 'Could not upload file/s, try again later',
            });
        }

        updateList();

        setIsLoading(false);
    }

    function keychangehandler(text){
        setKey(text)
    }

    async function downloadFile(file) {
        const blob = await getFileBlob(file.fullPath);
        const _file = new File([blob], file.name);
        decryptAndDownload(_file);
       
    }

    async function _downloadFile(file) {
        fetch(file.src)
            .then(res => res.blob())
            .then(blob => {
                const _file = new File([blob], file.name);
                encryptAndUpload(_file);
            });
    }


    async function deleteUserFile(id: string, fileName: string) {
        setIsLoading(true);
        await removeUserFile(id, fileName);
        await updateList();
        setIsLoading(false);
    }

    function updateList() {
        return getUserFiles(user.uid).then(data => {
            console.log('getUserFiles', data);

            setFiles(data);
        })
    }

    function encryptAndUpload(file: File) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => {
                
                var wordArray = CryptoJS.lib.WordArray.create(reader.result as any);           
                var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();        

                var fileEnc = new Blob([encrypted]);                                    

                uploadFile(user.uid,key? fileEnc:file, file.name).then(x => {
                    resolve(x);
                }).catch(err => reject(err));

            };
            reader.readAsArrayBuffer(file);
        })
    }

    function convertWordArrayToUint8Array(wordArray) {
        var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
        var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
        var uInt8Array = new Uint8Array(length), index = 0, word, i;
        for (i = 0; i < length; i++) {
            word = arrayOfWords[i];
            uInt8Array[index++] = word >> 24;
            uInt8Array[index++] = (word >> 16) & 0xff;
            uInt8Array[index++] = (word >> 8) & 0xff;
            uInt8Array[index++] = word & 0xff;
        }
        return uInt8Array;
    }

    function decryptAndDownload(file: File) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => {
                

                var decrypted = CryptoJS.AES.decrypt(reader.result as any, key);            
                var typedArray = convertWordArrayToUint8Array(decrypted);               

                var fileDec = new Blob([typedArray]);                                   

                var a = document.createElement("a");
                var url = window.URL.createObjectURL(fileDec);
                var filename = file.name;
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            };
            reader.readAsText(file);
        })
    }
}

export default FilesList;
