import { Container, FlexRow, Spacer } from '../ui';
import { Avatar, BackgroundImage, Box, Burger, Button, Divider, Header as _Header, Space, Text, useMantineTheme } from '@mantine/core';
import { auth } from '../services/firebase';
import { RiUserFill } from 'react-icons/ri';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logo from './logo';
import { useMediaQuery } from '@mantine/hooks';
import { useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import DarkToggle from './dark-toggle';

export interface HeaderProps {
    height: string;
    withBackground?: boolean;
    component?: JSX.Element;
    outComponent?: JSX.Element;

    showBurger?: boolean;
    burgerOpened?: boolean;
    onBurgerClick?: () => void;
}
export function Header({ height, withBackground, component, outComponent, showBurger, burgerOpened, onBurgerClick }: HeaderProps) {
    const [user] = useAuthState(auth);
    const location = useLocation();
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

    if (withBackground)
        return (
            <>
                <BackgroundImage
                    src="/static/pattren.svg"
                    sx={theme => ({
                        backgroundColor: theme.colorScheme == 'dark' ? theme.colors.dark[9] : theme.colors.brand[0],
                        backgroundPosition: 'right',
                    })}
                >
                    {header()}
                </BackgroundImage>
                {outComponent}
            </>
        );

    return header();

    function header() {
        return (
            <>
                <_Header height={height} withBorder={!component} sx={{ backgroundColor: 'transparent' }}>
                    <Container style={{ paddingTop: 5 }}>
                        <FlexRow>
                            {showBurger && isSm && <Burger opened={burgerOpened || false} onClick={() => onBurgerClick?.()} size="sm" mr="xl" />}
                            <Logo height={50} />
                            <Spacer />

                            {/* logged in */}
                            {user && (
                                <FlexRow>
                                    {location.pathname != '/profile' && (
                                        <>
                                            <FlexRow>
                                                <Avatar src={user.photoURL} radius="xl">
                                                    <RiUserFill color={theme.colors.brand[7]} />
                                                </Avatar>
                                                <Space w={10} />
                                                {!isXs && <Text color="dark.3">{user?.displayName || user?.email}</Text>}
                                            </FlexRow>
                                            <Divider orientation="vertical" mx="sm" sx={{ height: 36 }} my="auto" />
                                            <Button variant="default" onClick={logout} style={{border: 'none'}}>
                                                Logout
                                            </Button>
                                            <Divider orientation="vertical" mx="sm" sx={{ height: 36 }} my="auto" />
                                            <DarkToggle />
                                        </>
                                    )}
                                </FlexRow>
                            )}
                        </FlexRow>
                    </Container>
                </_Header>
                {component && (
                    <Box>
                        <Container>{component}</Container>
                    </Box>
                )}
            </>
        );
    }

    function logout() {
        signOut(auth);
    }
}

export default Header;
