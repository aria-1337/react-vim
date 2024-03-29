import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface PowerlineProps {
    mode: string;
    text: string;
    selectedRow: number;
    cursorPos: number;
}

export default function Powerline({ mode, text, selectedRow, cursorPos }: PowerlineProps) {
    const [m, setM] = useState<string>(mode);

    function formatMode(gMode: string) {
        return '~' + gMode.toUpperCase() + '~';
    }

    useEffect(() => {
        setM(formatMode(mode));
    }, [mode]);

    return (<Container>
        <ModeText>{ m }</ModeText>
        <PositionText>{ (selectedRow + 1) + ', ' + (cursorPos + 1) }</PositionText>
    </Container>);
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    min-width: 100%;
    padding: 5px 0px;
    justify-content: space-between;
`;

const ModeText = styled.p`
    font-size: 12px;
    font-weight: bold;
    margin: 0;
`;

const PositionText = styled.p`
    margin: 0;
    font-size: 12px;
`;
