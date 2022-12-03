import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useForm, Vals } from '../../hooks/useForm';
import { useResponsive } from '../../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeaderFooterLayout from '../../layouts/header-footer-layout';
import { Dropzone } from '@mantine/dropzone';
import { Group, useMantineTheme, Text, Table } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { addUserFile, getUserFiles, uploadFile } from '../../services/users-service';
import { showNotification } from '@mantine/notifications';

function FilesList() {
    const [user, userIsLoading, userError] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const { responsive } = useResponsive();
    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login')
        } else {
            getUserFiles(user.uid).then(data => {
                console.log('getUserFiles', data);
                
                setFiles(data);
            })
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
                                <td style={{ textAlign: 'start' }}>{'actions'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

        </HeaderFooterLayout>
    );


    async function handleDrop(files) {

        setIsLoading(true);

        try {
            if (!Array.isArray(files)) files = [files];
            const promises = files.map(file => uploadFile(user.uid, file));


            const uploadedFiles = await Promise.all(promises);

            console.log(uploadedFiles);

            const filesPromises = uploadedFiles.map(file => addUserFile({ userId: user.uid, file }))

            await Promise.all(filesPromises);

        } catch (error) {
            showNotification({
                color: 'red',
                message: 'Could not upload file/s, try again later',
            });
        }

        setIsLoading(false);
    }
}

export default FilesList;
