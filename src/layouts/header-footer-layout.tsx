import { Container } from '../ui';
import { Space, useMantineTheme } from '@mantine/core';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import AppShell from './app-shell';

export interface HeaderFooterLayoutProps {
    children?: any;
    headerComponent?: JSX.Element;
    headerOutComponent?: JSX.Element;
    isBackgroundHeader?: boolean;
}
function HeaderFooterLayout({ children, headerComponent, headerOutComponent, isBackgroundHeader }: HeaderFooterLayoutProps) {
    const theme = useMantineTheme();
    const dark = theme.colorScheme == 'dark';
    return (
        <AppShell
            header={
                <Header
                    height="70px"
                    component={headerComponent}
                    outComponent={headerOutComponent}
                    withBackground={!dark && isBackgroundHeader}
                />
            }
            footer={<Footer height="48px" />}
        >
            {!headerComponent && <Space h={40} />}
            <Container>{children}</Container>
            <Space h={40} />
        </AppShell>
    );
}

export default HeaderFooterLayout;
