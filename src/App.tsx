import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Line from './components/Line';

export default function App() {
    const [editor, setEditor] = useState({
        selectedRow: 1,
        cursorPos: 0,
        rows: [{ n: 1, text: 'some default text' }]
    });
    return (<>
    <h1>Vim</h1>
    <EditorWrapper>
        { editor?.rows?.map((r, key) => <Line key={key} n={r.n} text={r.text} />) }
        <Line key={'end'} n={0} text={''} />
    </EditorWrapper>
    </>);
}

const EditorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    padding: 5px;
`;
