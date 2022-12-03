import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useForm, Vals } from '../../hooks/useForm';
import { useResponsive } from '../../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import HeaderFooterLayout from '../../layouts/header-footer-layout';
import { Dropzone } from '@mantine/dropzone';
import { Group, useMantineTheme, Text, Table } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';

function FilesList() {
    const [user, userIsLoading, userError] = useAuthState(auth);
    const { responsive } = useResponsive();
    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login')
        }
    }, [user])

    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];

    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td style={{textAlign: 'start'}}>{element.position}</td>
            <td style={{textAlign: 'start'}}>{element.name}</td>
            <td style={{textAlign: 'start'}}>{element.symbol}</td>
            <td style={{textAlign: 'start'}}>{element.mass}</td>
        </tr>
    ));

    return (
        <HeaderFooterLayout>

            {/* upload files */}
            <Dropzone
                onDrop={(files) => console.log('accepted files', files)}
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
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>

            {/* files list */}

            <Table sx={{marginTop: 100}}>
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>

        </HeaderFooterLayout>
    );

    function logout() {
        signOut(auth);
    }
}

export default FilesList;
