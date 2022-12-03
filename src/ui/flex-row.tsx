import { Box, MantineStyleSystemProps, Sx, useMantineTheme } from '@mantine/core';
import { useResponsive } from '../hooks/useResponsive';

/* eslint-disable-next-line */
export interface FlexRowProps extends MantineStyleSystemProps {
    children?: any;
    justify?: 'space-between' | 'space-around' | 'center' | 'flex-end' | 'flex-start';
    height?: number | string;
    weight?: number;
    wrap?: boolean;
    breakpoint?: 'xs' | 'sm' | 'md' | 'lg';
    grow?: boolean;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    sx?: Sx;
    align?: 'flex-end' | 'flex-start' | 'center' | 'stretch' | 'baseline';
    order?: number;
}

export function FlexRow({ sx, align = 'center',order, children, height, justify, weight, wrap, grow, breakpoint, gap, ...mss }: FlexRowProps) {
    const theme = useMantineTheme();
    const spacing = theme.spacing;
    const { responsive } = useResponsive();
    return (
        <Box
            {...mss}
            sx={{
                width: grow ? '100%' : undefined,
                display: 'flex',
                justifyContent: justify,
                alignItems: align,
                minHeight: height,
                flex: weight,
                gap: gap ? (typeof gap == 'string' ? spacing[gap] : gap) : 0,
                flexWrap: wrap ? 'wrap' : wrap === false ? 'nowrap' : undefined,
                ...(breakpoint
                    ? responsive({
                          [breakpoint]: {
                              flexDirection: 'column',
                              alignItems: align,
                              height: 'auto',
                          },
                      })
                    : {}),
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

export default FlexRow;
