import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface LineProps {
    n: number;
    text: string; 
    selected: number;
}

export default function Line({ n, text, selected } : LineProps) {
    const [v, setV] = useState(text);
    function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
        setV(e?.target?.value);
    }

    useEffect(() => {
        setV((oldV) => text);
    }, [text]);

    return (<LineContainer selected={(n === selected+1).toString()}>
        <LineNumber>{ n === 0 ? '~' : n }</LineNumber>
        <LineText value={v} onChange={(e) => handleTyping(e)}/>
    </LineContainer>);
}

const LineContainer = styled.div<{ selected: string }>`
    background-color: ${props => props.selected === 'true' ? 'gray' : 'transparent' };
    display: flex;
    flex-direction: row;
`;

const LineNumber = styled.p`
    margin: 1px;
    color: red;
    font-weight: bold;
`;

const LineText = styled.input`
    margin: 1px;
    border: none;
    font-family: inherit;
    font-weight: inherit;
    font-size: 14px;
`;
