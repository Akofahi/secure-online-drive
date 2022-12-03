import { useMantineTheme } from '@mantine/core';
import { useCallback } from 'react';

export function useResponsive() {
    const theme = useMantineTheme();

    const responsive = useCallback(
        (styles: {
            xs?: React.CSSProperties;
            sm?: React.CSSProperties;
            md?: React.CSSProperties;
            lg?: React.CSSProperties;
            xl?: React.CSSProperties;

            xsUp?: React.CSSProperties;
            smUp?: React.CSSProperties;
            mdUp?: React.CSSProperties;
            lgUp?: React.CSSProperties;
            xlUp?: React.CSSProperties;

            xsOnly?: React.CSSProperties;
            smOnly?: React.CSSProperties;
            mdOnly?: React.CSSProperties;
            lgOnly?: React.CSSProperties;
            xlOnly?: React.CSSProperties;
        }): any => {
            const output: Record<string, React.CSSProperties> = {};
            const { xs, sm, md, lg, xl } = theme.breakpoints;
            if (styles.xs) output[`@media (max-width: ${xs}px)`] = { ...styles.xs };
            if (styles.sm) output[`@media (max-width: ${sm}px)`] = { ...styles.sm };
            if (styles.md) output[`@media (max-width: ${md}px)`] = { ...styles.md };
            if (styles.lg) output[`@media (max-width: ${lg}px)`] = { ...styles.lg };
            if (styles.xl) output[`@media (max-width: ${xl}px)`] = { ...styles.xl };

            if (styles.xsUp) output[`@media (min-width: ${xs + 1}px)`] = { ...styles.xsUp };
            if (styles.mdUp) output[`@media (min-width: ${md + 1}px)`] = { ...styles.mdUp };
            if (styles.smUp) output[`@media (min-width: ${sm + 1}px)`] = { ...styles.smUp };
            if (styles.lgUp) output[`@media (min-width: ${lg + 1}px)`] = { ...styles.lgUp };
            if (styles.xlUp) output[`@media (min-width: ${xl + 1}px)`] = { ...styles.xlUp };

            if (styles.smOnly) output[`@media (min-width: ${sm}px) and (max-width: ${md}px)`] = { ...styles.smOnly };
            if (styles.mdOnly) output[`@media (min-width: ${md}px) and (max-width: ${lg}px)`] = { ...styles.mdOnly };
            if (styles.lgOnly) output[`@media (min-width: ${lg}px) and (max-width: ${xl}px)`] = { ...styles.lgOnly };

            return output;
        },
        [theme.breakpoints]
    );

    return { responsive };
}