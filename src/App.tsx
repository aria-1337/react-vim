import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Line from './components/Line';
import UseKeyPress from './hooks/UseKeypress';

export default function App() {
    // Editor Logic
    const [rows, setRows] = useState([{ n: 1, text: 'some default text' }]);
    const [keypresses, setKeypresses] = useState<Array<number>>([]);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [cursorPos, setCursorPos] = useState<number>(0);
    const [mode, setMode] = useState<string>('normal');

    // Track keypresses and store them to memory
    const [mem, setMem] = useState<Array<{ code: number, char: string, event: string }>>([]);
    const { code, char, event }  = UseKeyPress();
    useEffect(() => {
        setMem((oldMem) => {
            const newMem = [...oldMem, { code, char, event }];
            while (newMem.length > 100) {
                newMem.shift();
            }
            return newMem;
        });

        // ESC Modifier => Return to normal mode 
        if (char === 'Esc' && event === 'down') {
            setMode('normal');
        }

        // While in normal + I => Insert mode
        if (mode === 'normal' && char === 'I' && event === 'down') {
            setMode('insert');
        } 
    }, [code, char, event, mode]);

    // @addLine()
    // This function created a new line is initially appended to the last Line instance.
    // It should be called during the following scenarios:
    // [] Enter press on keyboard -> Enters line @ n+1
    function addLine() {
    }

    return (<>
    <h1>Vim</h1>
    <p>{ `code: ${code} ___ char: ${char} ___ event: ${event}` }</p>
    <p>{ `mode: ${mode}` }</p>
    <p>{ `mem: ${mem.map(({ code, char, event}) => `${code} | ${char} | ${event}`)}`}</p>
    <EditorWrapper>
        { rows?.map((r, key) => <Line key={key} n={r.n} text={r.text} />) }
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
