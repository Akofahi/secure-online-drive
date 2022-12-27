import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { saveAs } from 'file-saver';
import { useResponsive } from '../../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeaderFooterLayout from '../../layouts/header-footer-layout';
import { Dropzone } from '@mantine/dropzone';
import { Group, useMantineTheme, Text, Table, ActionIcon, Input, Grid, Space, Modal, TextInput, Button, PasswordInput, CopyButton } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconDownload, IconTrash, IconPassword, IconKey, IconEye, IconEyeOff, IconSearch } from '@tabler/icons';
import { addUserFile, deleteUserFile, getFileBlob, getUserFiles, removeUserFile, uploadFile } from '../../services/users-service';
import { showNotification } from '@mantine/notifications';
import CryptoJS from 'crypto-js';
import e from 'express';
import { FlexCol, FlexRow } from '../../ui';

function FilesList() {
    const [user, userIsLoading, userError] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const { responsive } = useResponsive();
    const navigate = useNavigate();
    const theme = useMantineTheme();

    const [filterText, setFilterText] = useState("");

    const [encKey, setEncKey] = useState("");
    const [decKey, setDecKey] = useState("");

    const [encKeyTemp, setEncKeyTemp] = useState("");
    const [decKeyTemp, setDecKeyTemp] = useState("");

    const [encKeyBlured, setEncKeyBlured] = useState(true);
    const [decKeyBlured, setDecKeyBlured] = useState(true);

    const [openedEncKey, setOpenedEncKey] = useState(false);
    const [openedDecKey, setOpenedDecKey] = useState(false);


    useEffect(() => {
        if (!user) {
            navigate('/auth/login')
        } else {
            updateList()
        }
    }, [user])

    const bluredCss = {
        color: 'transparent',
        textShadow: ' 0 0 7px rgba(0,0,0,0.9)'
    }

    return (
        <HeaderFooterLayout>

            {/* keys */}

            <Grid columns={2}>
                <Grid.Col lg={1}>
                    <FlexCol>

                        <FlexRow justify='center'>
                            Encryption Key
                            <Space w={20} />
                            <ActionIcon onClick={() => setOpenedEncKey(true)}>
                                <IconKey />
                            </ActionIcon>
                        </FlexRow>

                        <FlexRow justify='center'>
                            {encKey && <>
                                <Text sx={encKeyBlured ? bluredCss : {} } style={{fontSize: "70%"}}>{encKey}</Text>
                                <Space w={20} />
                                <CopyButton value={encKey}>
                                    {({ copied, copy }) => (
                                        <Button variant={'white'} color={copied ? 'teal' : 'blue'} onClick={copy}>
                                            {copied ? 'Copied' : 'Copy key'}
                                        </Button>
                                    )}
                                </CopyButton>
                                {!encKeyBlured && <ActionIcon onClick={() => setEncKeyBlured(true)}>
                                    <IconEyeOff />
                                </ActionIcon>}
                                {encKeyBlured && <ActionIcon onClick={() => setEncKeyBlured(false)}>
                                    <IconEye />
                                </ActionIcon>}
                                <ActionIcon onClick={() => { setEncKey(''); setEncKeyTemp('') }}>
                                    <IconTrash />
                                </ActionIcon>
                            </>}
                        </FlexRow>
                    </FlexCol>
                </Grid.Col>
                <Grid.Col lg={1}>
                    <FlexCol>
                        <FlexRow justify='center'>
                            Decryption Key
                            <Space w={20} />
                            <ActionIcon onClick={() => setOpenedDecKey(true)}>
                                <IconKey />
                            </ActionIcon>
                        </FlexRow>


                        <FlexRow justify='center'>

                            {decKey && <>
                                <Text sx={decKeyBlured ? bluredCss : {}}>{decKey}</Text>
                                <Space w={20} />
                                <CopyButton value={decKey}>
                                    {({ copied, copy }) => (
                                        <Button variant={'white'} color={copied ? 'teal' : 'blue'} onClick={copy}>
                                            {copied ? 'Copied' : 'Copy key'}
                                        </Button>
                                    )}
                                </CopyButton>
                                {!decKeyBlured && <ActionIcon onClick={() => setDecKeyBlured(true)}>
                                    <IconEyeOff />
                                </ActionIcon>}
                                {decKeyBlured && <ActionIcon onClick={() => setDecKeyBlured(false)}>
                                    <IconEye />
                                </ActionIcon>}
                                <ActionIcon onClick={() => { setDecKey(''); setDecKeyTemp('') }}>
                                    <IconTrash />
                                </ActionIcon>
                            </>}

                        </FlexRow>
                    </FlexCol>
                </Grid.Col>
            </Grid>

            {/* modals */}
            <Modal
                opened={openedEncKey}
                onClose={() => setOpenedEncKey(false)}
                title="Enter Encryption Key"
            >
                <FlexCol>
                    <PasswordInput sx={{ flex: 1 }} onChange={e => setEncKeyTemp(e.target.value)} />
                    <Space w={10} />
                    <Button sx={{ margin: '1rem auto' }} onClick={() => { setEncKey(encKeyTemp); setOpenedEncKey(false) }}>Save</Button>
                    <Button variant='white' onClick={() => {
                        setEncKey(generateKey());
                        setOpenedEncKey(false);
                    }}>Generate random key</Button>
                </FlexCol>
            </Modal>

            <Modal
                opened={openedDecKey}
                onClose={() => setOpenedDecKey(false)}
                title="Enter Decryption Key"
            >
                <FlexCol>
                    <FlexRow>
                        <PasswordInput sx={{ flex: 1 }} onChange={e => setDecKeyTemp(e.target.value)} />
                        <Space w={10} />
                    </FlexRow>
                    <Button sx={{ margin: '1rem auto' }} onClick={() => { setDecKey(decKeyTemp); setOpenedDecKey(false) }}>Save</Button>
                </FlexCol>
            </Modal>

            {/* upload files */}
            <Dropzone
                sx={{ marginTop: 50 }}
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

            <Space h={100}></Space>
            <TextInput placeholder='Type to search...' icon={<IconSearch size={16} />} onChange={e => setFilterText(e.target.value)} />
            <Space h={50}></Space>


            <Table>
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
                        files?.filter(x =>
                            !filterText || (x.file.name as string).toLowerCase().includes(filterText.toLowerCase())
                        ).map((x) => (
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
                var encrypted = CryptoJS.AES.encrypt(wordArray, encKey).toString();

                var fileEnc = new Blob([encrypted]);

                uploadFile(user.uid, encKey ? fileEnc : file, file.name).then(x => {
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


                var decrypted = CryptoJS.AES.decrypt(reader.result as any, decKey);
                var typedArray = convertWordArrayToUint8Array(decrypted);

                var fileDec = new Blob([typedArray]);

                var a = document.createElement("a");
                var url = window.URL.createObjectURL(decKey ? fileDec : file);
                var filename = file.name;
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            };
            reader.readAsText(file);
        })
    }

    function generateKey() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 64; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

export default FilesList;
