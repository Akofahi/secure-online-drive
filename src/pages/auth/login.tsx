import { SimpleGrid, Space, TextInput, Text, Button, Anchor, Box, Alert, PasswordInput, LoadingOverlay } from '@mantine/core';
import AsideFooterLayoutProps from '../../layouts/aside-footer-layout';
import { AiOutlineMail } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';
import { auth } from '../../services/firebase';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { IconAlertCircle } from '@tabler/icons';
import { signOut } from 'firebase/auth';
import { useForm, Vals } from '../../hooks/useForm';
import { FlexRow } from '../../ui';
import { useResponsive } from '../../hooks/useResponsive';
import {Link, useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';

function Login() {
    const [user, userIsLoading, userError] = useAuthState(auth);
    const [signInWithEmailAndPassword, userAfterSingIn, signInIsLoading, signInError] = useSignInWithEmailAndPassword(auth);
    const { responsive } = useResponsive();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userError) return;
        showNotification({
            color: 'red',
            message: userError.message,
        });
    }, [userError]);

    useEffect(() => {
        if(!user) return;
        navigate('/')
    }, [user])
    const form = useForm({
        email: ['', [Vals.required(), Vals.email()]],
        password: ['', [Vals.required(), Vals.minLength(6)]],
    });


    return (
        <AsideFooterLayoutProps>
            <Box
                sx={{
                    maxWidth: 400,
                    position: 'relative',
                    ...responsive({
                        md: {
                            maxWidth: 'unset',
                            padding: '2rem',
                        },
                    }),
                }}
            >
                <LoadingOverlay visible={userIsLoading} overlayBlur={2} />
                <h1>Login</h1>

                {signInError && (
                    <>
                        <Space h={24} />
                        <Alert icon={<IconAlertCircle size={16} />} title="Something went wrong!" color="red">
                            {signInError.code === 'auth/user-not-found' && 'Invalid username/password'}
                            {signInError.message === 'INVALID_PASSWORD' && 'Invalid username/password'}
                        </Alert>
                    </>
                )}

                <Space h={24} />
                <form onSubmit={form.onSubmit(values => doSignIn(values))}>
                    <SimpleGrid cols={1}>
                        <TextInput
                            size="md"
                            label=""
                            required
                            icon={<AiOutlineMail />}
                            placeholder="Email"
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            icon={<FiLock />}
                            placeholder="Password"
                            label=""
                            description=""
                            required
                            {...form.getInputProps('password')}
                        />
                    </SimpleGrid>
                    <Space h={40} />

                    <Button sx={{ width: '100%' }} type="submit" size="md" loading={signInIsLoading}>
                        Sign In
                    </Button>
                </form>
                <Space h={40} />
                <FlexRow wrap justify="center">
                    <Text span size={'md'}>
                        Don’t have an account yet?
                    </Text>
                    <Anchor mx={'xs'} component={Link} to="/auth/register">
                        Sign Up
                    </Anchor>
                </FlexRow>
                <FlexRow mt='md' justify="center">
                    <Anchor mx={'xs'} color="dimmed" component={Link} to="/auth/reset-password">
                        forgot your password?
                    </Anchor>
                </FlexRow>
            </Box>
        </AsideFooterLayoutProps>
    );

    function doSignIn(values: any) {
        const { email, password } = values;
        signInWithEmailAndPassword(email, password);
    }

    function logout() {
        signOut(auth);
    }
}

export default Login;
