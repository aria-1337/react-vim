import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface LineProps {
    n: number;
    text: string; 
    selected: number;
    cursorPos: number;
    setCursorPos: Function;
}

export default function Line({ n, text, selected, cursorPos, setCursorPos } : LineProps) {
    const [t, setT] = useState<string>(text);
    const [active, setActive] = useState<string>('false');

    useEffect(() => {
        setT((oldText) => {
            setActive((_) => {
                const active = (n === selected+1);
                return active.toString();
            });
            return text;
        });
    }, [text, selected, cursorPos]);

    return (<LineContainer selected={active}>
        <LineNumber>{ n === 0 ? '~' : n }</LineNumber>
        <TextContainer>
            { t.split('').map((i, x) => <TextCell selected={(x === cursorPos && active).toString()}>{ i }</TextCell>)}
        </TextContainer>
    </LineContainer>);
}

const TextContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const TextCell = styled.div<{ selected: string }>`
    white-space: pre-wrap;
    background-color: ${props => props.selected === 'true' ? 'black' : 'transparent'};
`;

const LineText = styled.div`
    flex-direction: row;
    margin: 1px;
    border: none;
    font-family: inherit;
    font-weight: inherit;
    font-size: 14px;
`;

const LineContainer = styled.div<{ selected: string }>`
    background-color: ${props => props.selected === 'true' ? 'whitesmoke' : 'transparent' };
    display: flex;
    flex-direction: row;
    ${LineText} {
        background-color: ${props => props.selected === 'true' ? 'whitesmoke' : 'transparent' };
    }
`;

const LineNumber = styled.p`
    margin: 1px;
    color: red;
    font-weight: bold;
`;

const Cursor = styled.div`
    min-width: 10px;
    min-height: 10px;
    color: white;
    background-color: black;
    text-align: center;
`;
