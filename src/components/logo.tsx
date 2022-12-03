import { useMantineColorScheme, Image, Anchor } from '@mantine/core';

export interface LogoProps {
    height: number;
}
function Logo({ height }: LogoProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    return (
        <Image
            sx={{ margin: 'auto' }}
            height={height}
            width="auto"
            src={`/static/logo.svg`}
            alt="logo"
        />
    );
}

export default Logo;
