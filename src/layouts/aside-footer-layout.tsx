import { Container } from '../ui';
import { useResponsive } from '../hooks/useResponsive';
import { BackgroundImage, Grid, Space, Text, Title } from '@mantine/core';
import { Footer } from '../components/footer';
import Logo from '../components/logo';
import AppShell from './app-shell';
import DarkToggle from '../components/dark-toggle';

export interface AsideFooterLayoutProps {
    children?: any;
}
function AsideFooterLayout({ children }: AsideFooterLayoutProps) {
    const { responsive } = useResponsive();
    return (
        <AppShell footer={<Footer height="48px" />}>
            <DarkToggle  fixed />
            <Container style={{ padding: 0, position: 'relative' }}>
                <Grid gutter={'xl'}>
                    <Grid.Col md={5} sx={{ ...responsive({ mdUp: { position: 'relative' } }) }}>
                        <BackgroundImage
                            sx={theme => ({
                                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.brand[7],
                                width: '100%',
                                padding: '2rem',
                                backgroundPosition: 'top',
                                ...responsive({
                                    mdUp: {
                                        padding: '180px 16px',
                                        height: 'calc(100vh - 48px)',
                                        position: 'sticky',
                                        top: '0px',
                                        width: 'calc(100% + 1000px)',
                                        transform: 'translate(-1000px, 0px)',
                                        paddingLeft: 'calc(16px + 1000px)',
                                        backgroundSize: 'auto',
                                        backgroundPosition: 'bottom',
                                    },
                                }),
                            })}
                            src="/static/pattern-vertical.svg"
                        >
                            <Logo height={230} />   
                            <Title sx={{marginTop: '2rem', color: '#ffffff'}}>Secure Online Storage</Title>               
                        </BackgroundImage>
                    </Grid.Col>
                    <Grid.Col md={7} sx={{ ...responsive({ mdUp: { padding: '140px 100px' } }) }}>
                        <Container>{children}</Container>
                    </Grid.Col>
                </Grid>
            </Container>
        </AppShell>
    );
}

export default AsideFooterLayout;
