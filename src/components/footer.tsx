import { Anchor, Group, Text, Footer as _Footer, useMantineTheme } from '@mantine/core';
import { Container, FlexRow } from '../ui';
import { RiLinkedinFill } from 'react-icons/ri';
import { RiWhatsappFill } from 'react-icons/ri';
import { BsYoutube } from 'react-icons/bs';
import { useMediaQuery } from '@mantine/hooks';
import { MdEmail } from 'react-icons/md';
import { AiFillInstagram } from 'react-icons/ai';

/* eslint-disable-next-line */
export interface FooterProps {
    height: string;
    fixed?: boolean;
}
export function Footer({ height }: FooterProps) {
    const {
        breakpoints: { lg },
        colors,
    } = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${lg}px)`);

    const linkProps = {
        color: 'gray',
        size: 'sm' as any,
        target: '_blank',
        sx: { ':hover': { color: colors.brand[7] } },
    };

    return (
        <_Footer height={mobile ? 'auto' : height} fixed={!mobile} style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Container>
                <FlexRow justify="space-between" align="center" breakpoint="md">
                    {/* copyright */}
                    <FlexRow breakpoint='xs'>
                        <Text mb={mobile ? 'md' : 0} size="sm">
                            © 2022
                        </Text>
                        <Text mb={mobile ? 'md' : 0} mx="xs" size="sm" color='gray'>
                            Made by{' '}
                            <Anchor rel="nofollow" color='gray' href="#" sx={theme => ({
                                ':hover': {
                                    color: theme.colors.brand[7],
                                    fontWeight: 'bold'
                                }
                            })}>
                                Ahmad Al-Kofahi
                            </Anchor>
                        </Text>
                    </FlexRow>

                    {/* links */}
                    <Group mb={mobile ? 'md' : 0}>
                        <Anchor href="#" {...linkProps}>
                            Amman Arab University
                        </Anchor>
                    </Group>

                    {/* socials */}
                    <Group mb={mobile ? 'md' : 0}>
                        <Anchor href="#" target="_blank">
                            <RiLinkedinFill size={22} />
                        </Anchor>
                        <Anchor href="#" target="_blank">
                            <RiWhatsappFill size={22} />
                        </Anchor>
                        <Anchor href="#" target="_blank">
                            <AiFillInstagram size={22} />
                        </Anchor>
                        <Anchor href="#" target="_blank">
                            <BsYoutube size={22} />
                        </Anchor>
                        <Anchor href="mailto:akofahi92@gmail.com" target="_blank">
                            <MdEmail size={22} />
                        </Anchor>
                    </Group>
                </FlexRow>
            </Container>
        </_Footer>
    );
}

export default Footer;
