import { SimpleGrid, Space, TextInput, Text, Button, Anchor, Box, Alert, Title } from '@mantine/core';
import AsideFooterLayoutProps from '../../layouts/aside-footer-layout';
import { AiOutlineLeft, AiOutlineMail } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import { auth } from '../../services/firebase';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { IconAlertCircle } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useForm, Vals } from '../../hooks/useForm';
import { FlexRow } from '../../ui';

function ResetPassword() {
    const [success, setSuccess] = useState(false);
    const [requested, setRequested] = useState(false);
    const [sendPasswordResetEmail, loading, error] = useSendPasswordResetEmail(auth);
    const { responsive } = useResponsive();
    const form = useForm({
        email: ['', [Vals.required(), Vals.email()]],
    });

    useEffect(() => {
        if (!loading) return;
        setRequested(true);
    }, [loading]);

    useEffect(() => {
        setSuccess(requested && !loading && !error);
    }, [requested, loading, error]);

    return (
        <AsideFooterLayoutProps>
            <Box
                sx={{
                    maxWidth: 300,
                    position: 'relative',
                    ...responsive({
                        md: {
                            maxWidth: 'unset',
                            padding: '2rem',
                        },
                    }),
                }}
            >

                <Title>Password Reset</Title>

                {error && (
                    <>
                        <Space h={32} />
                        <Alert icon={<IconAlertCircle size={16} />} title="Email not found" color="red">
                            Please try again
                        </Alert>
                    </>
                )}

                <Space h={32} />

                {!success && (
                    <>
                        <form onSubmit={form.onSubmit(values => sendPasswordResetEmail(values.email))}>
                            <SimpleGrid cols={1}>
                                <TextInput
                                    size="md"
                                    label=""
                                    required
                                    icon={<AiOutlineMail />}
                                    placeholder="Email"
                                    {...form.getInputProps('email')}
                                />
                            </SimpleGrid>
                            <Space h={40} />

                            <Button sx={{ width: '100%' }} type="submit" size="md" loading={loading}>
                                Request Password Reset
                            </Button>
                        </form>
                        <Space h={40} />
                        <FlexRow justify="center">
                            <Text span size={'md'}>
                                Don’t have an account yet?
                            </Text>
                            <Anchor mx={'xs'} to="/auth/register" component={Link}>
                                Sign Up
                            </Anchor>
                        </FlexRow>
                    </>
                )}

                {success && (
                    <>
                        <Text span size={'lg'}>
                            Reset password link was sent to your email address.
                        </Text>
                        <Anchor mx={'md'} to="/auth/login" component={Link}>
                            Go to login page
                        </Anchor>
                    </>
                )}
            </Box>
        </AsideFooterLayoutProps>
    );
}

export default ResetPassword;
