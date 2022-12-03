/* eslint-disable-next-line */
export interface FlexColProps {
    children?: any;
    align?: 'space-between' | 'space-around' | 'center';
    width?: number | string;
    weight?: number;
}

export function FlexCol({ children, width, align, weight }: FlexColProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: align,
                width,
                flex: weight,
            }}
        >
            {children}
        </div>
    );
}

export default FlexCol;
