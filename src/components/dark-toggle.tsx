import { useMantineColorScheme, ActionIcon, useMantineTheme, Box, Tooltip } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { BsSunFill, BsSun, BsMoonStarsFill, BsMoonStars } from 'react-icons/bs';

interface Props {
    fixed?: boolean;
}
function DarkToggle({ fixed }: Props) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const { hovered: hoveredLight, ref: refLight } = useHover();
    const { hovered: hoveredDark, ref: refDark } = useHover();
    const theme = useMantineTheme();

    return (
        <div style={{
            position: fixed ? 'fixed' : 'static',
            top: 20,
            right: 20
        }}>

            <Tooltip

                label={`Change to ${dark ? 'light' : 'dark'} theme`}>
                <Box>
                    <ActionIcon
                        ref={refLight as any}
                        sx={{ display: dark ? 'block' : 'none' }}
                        variant="transparent"
                        onClick={() => toggleColorScheme()}
                        size="lg"
                    >
                        {hoveredLight ? <BsSunFill color={theme.colors.yellow[4]} /> : <BsSun color={theme.colors.dark[4]} />}
                    </ActionIcon>
                    <ActionIcon
                        ref={refDark as any}
                        sx={{ display: !dark ? 'block' : 'none' }}
                        variant="transparent"
                        onClick={() => toggleColorScheme()}
                        size="lg"
                    >
                        {hoveredDark ? <BsMoonStarsFill color={theme.colors.dark[4]} /> : <BsMoonStars size={18} color={theme.colors.gray[7]} />}
                    </ActionIcon>
                </Box>
            </Tooltip>
        </div>
    );
}

export default DarkToggle;
