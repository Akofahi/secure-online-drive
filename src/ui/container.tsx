import { Container as _Container } from '@mantine/core';

export interface ContainerProps {
    children?: any;
    style?: any;
}

export function Container({ children, style }: ContainerProps) {
    return (
        <_Container size="xl" style={style}>
            {children}
        </_Container>
    );
}

export default Container;
