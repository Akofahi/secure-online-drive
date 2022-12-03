import { SimpleGrid, Space, TextInput, Text, Button, Anchor, Box, PasswordInput, Title } from '@mantine/core';
import AsideFooterLayout from '../../layouts/aside-footer-layout';
import { AiOutlineMail } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { auth } from '../../services/firebase';
import { Link } from 'react-router-dom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm, Vals } from '../../hooks/useForm';
import { FlexRow } from '../../ui';
import { useResponsive } from '../../hooks/useResponsive';
import { showNotification } from '@mantine/notifications';

function Register() {
    const [createUserWithEmailAndPassword, registeredUser, registerIsLoading, registerError] = useCreateUserWithEmailAndPassword(auth);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { responsive } = useResponsive();
    const form = useForm({
        email: ['', [Vals.required(), Vals.email()]],
        password: ['', [Vals.required(), Vals.minLength(6)]],
        passwordConfirm: ['', [Vals.match('password')]],
    });

    useEffect(() => {
        if (!registerError) return;
        showNotification({
            color: 'red',
            message: 'Could not sign up, please try again later',
        });
    }, [registerError]);

    useEffect(() => {
        if (!registeredUser) return;
        setSubmitted(true);
    }, [registeredUser]);


    if (submitted) return thankYou();

    return (
        <AsideFooterLayout>
            <Box
                sx={{
                    maxWidth: 700,
                    position: 'relative',
                    ...responsive({
                        md: {
                            maxWidth: 'unset',
                            padding: '2rem',
                        },
                    }),
                }}
            >

                <Title order={2}>Create Your Profile</Title>

                <Space h={42} />

                <form onSubmit={form.onSubmit(values => register(values))}>
                    <SimpleGrid
                        breakpoints={[
                            { minWidth: 'sm', cols: 1 },
                            { minWidth: 'md', cols: 1 },
                        ]}
                    >


                        <TextInput size="md" label="" icon={<AiOutlineMail />} placeholder="Email" {...form.getInputProps('email')} />
                        <PasswordInput size="md" icon={<FiLock />} placeholder="Password" required {...form.getInputProps('password')} />
                        <PasswordInput
                            size="md"
                            icon={<FiLock />}
                            placeholder="Confirm Password"
                            {...form.getInputProps('passwordConfirm')}
                        />
                    </SimpleGrid>

                    <Space h={40} />
                    <Button
                        sx={{ width: '100%' }}
                        type="submit"
                        size="md"
                        loading={!!registerIsLoading || loading}
                    >
                        Sign Up
                    </Button>
                </form>
                <Space h={40} />
                <FlexRow wrap justify="center">
                    <Text span size={'md'}>
                        Already have an account?
                    </Text>
                    <Anchor mx={'xs'} to="/auth/login" component={Link}>
                        Sign In
                    </Anchor>
                </FlexRow>
                <Space h={58} />
            </Box>
        </AsideFooterLayout>
    );

    function register(values: any) {
        console.log('register', values);

        const { email, password } = values;
        createUserWithEmailAndPassword(email, password);
    }

    function thankYou() {
        return (
            <AsideFooterLayout>
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
                    <Title order={1}>Thank You</Title>
                    <Space h={16} />
                    <Text>For signing up. please login.</Text>
                    <Space h={40} />
                    <Button
                        type="submit"
                        variant={'outline'}
                        size="md"
                        to="/auth/login"
                        component={Link}
                        loading={!!registerIsLoading || loading}
                    >
                        Go To Login Page
                    </Button>
                </Box>
            </AsideFooterLayout>
        );
    }
}

export default Register;
