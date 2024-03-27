import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Line from './components/Line';
import UseKeyPress from './hooks/UseKeypress';
import getModifiedChar from './utils/getModifiedChar';

export default function App() {
    // Editor Logic
    const [rows, setRows] = useState([{ n: 1, text: 'some default text' }]);
    const [keypresses, setKeypresses] = useState<Array<number>>([]);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [cursorPos, setCursorPos] = useState<number>(0);
    const [mode, setMode] = useState<string>('normal');

    // Track keypresses and store them to memory
    const [mem, setMem] = useState<Array<{ code: number, char: string, event: string }>>([]);
    const [modifier, setModifier] = useState<Array<string>>([]);
    const { code, char, event }  = UseKeyPress();
    useEffect(() => {
        setModifier((oldMod) => {
            // Remove/update modifier
            const idx = oldMod.indexOf(char);
            if (event === 'up' && idx !== -1) {
                oldMod.splice(idx, 1);
            } else if (event === 'down') {
                oldMod = [...oldMod, char];
            }

            // Add to memory based on current modifiers
            setMem((oldMem) => {
                // TODO: this should be a prop
                while (oldMem.length > 100) { oldMem.shift(); }

                if (oldMod.length > 0) {
                    oldMem = [...oldMem, { code, char: getModifiedChar(char, oldMod), event }];
                } else {
                    oldMem = [...oldMem, { code, char, event }];
                }
                return oldMem;
            });
            return oldMod;
        });
    }, [code, char, event]);


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
    <p>{ `mods: ${modifier}`}</p>
    <p>{ `mem: ${mem.map(({ code, char, event}) => `${code} | ${char} | ${event} \n`)}`} </p>
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
