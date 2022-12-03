// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { AppShell as Shell } from '@mantine/core';

export interface AppShellProps {
    headerHeight?: string;
    footerHeight?: string;
    header?: JSX.Element;
    footer?: JSX.Element;
    aside?: JSX.Element;
    navbar?: JSX.Element;
    children?: any;
    bg?: string;
    fixed?: boolean;
}
export function AppShell({ header, footer, aside, children, navbar, bg, fixed }: AppShellProps) {
    return (
        <Shell
            fixed={false}
            header={header}
            aside={aside}
            navbar={navbar}
            footer={footer}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            styles={theme => ({
                body: {
                    minHeight: `calc(100vh - ${header?.props?.height || '0px'} - ${footer?.props?.height || '0px'})`,
                },
                main: {
                    padding: 0,
                    backgroundColor: theme.colorScheme == 'dark' ? theme.colors.dark[7] : '#FFFFFF',
                },
            })}
        >
            {children}
        </Shell>
    );
}

export default AppShell;
