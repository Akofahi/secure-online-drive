import { Alert } from '@mantine/core';

/* eslint-disable-next-line */
export interface EmptyProps {
    title?: string;
    message?: string;
}

export function Empty({ title = 'No Data Found!', message = 'No records or Try adjusting your filters' }: EmptyProps) {
    return (
        <Alert title={title} color="brand">
            {message}
        </Alert>
    );
}

export default Empty;
