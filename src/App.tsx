import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Line from './components/Line';
import UseKeyPress from './hooks/UseKeypress';
import getModifiedChar from './utils/getModifiedChar';
import getLegalText from './utils/getLegalText';

interface Row {
    text: string;
}

export default function App() {
    // TODO: Eventaully we want to enable on click within component and disable on click out
    const [active, setActive] = useState(true);

    // Editor Logic
    const [rows, setRows] = useState<Array<Row>>([{ text: ' ' }]);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [cursorPos, setCursorPos] = useState<number>(0);
    const [cachedCursorPos, setCachedCursorPos] = useState<number>(0);
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
                if (code === -1) return oldMem;
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

    // On memory update create editor actions
    useEffect(() => {
        if (mem.length < 1) return;
        const lastAction = mem[mem.length-1];
        // BUG: This only triggers once as expected
        // console.log(lastAction);

        // get newest mode
        setMode((lastMode) => {
            // BUG: THIS IS TRIGGERING TWICE
            console.log(lastAction);
            let _mode = lastMode;

            // With newest mode handle keydown
            if (lastAction.event === 'down') {
                // In any mode arrow keys move
                if (lastAction.char === 'down') {
                    setSelectedRow((old) => {
                        if (rows?.[old+1]) { return old+1;}
                        return old;
                    });
                } else if (lastAction.char === 'up') {
                    setSelectedRow((old) => {
                        if(rows?.[old-1]) { return old-1; }
                        return old;
                    });
                } else if (lastAction.char === 'right') {
                    updateCursorPos('right', rows[selectedRow], cachedCursorPos);
                    return _mode;
                } else if (lastAction.char === 'left') {
                    updateCursorPos('left', rows[selectedRow], cachedCursorPos);
                    return _mode;
                }
                // handle mode changes
                if (lastMode !== 'normal' && lastAction.char === 'esc') {
                    return 'normal';
                } else if (lastMode === 'normal' && lastAction.char === 'i') {
                    return 'insert';
                } else if (lastMode === 'normal' && lastAction.char === 'v') {
                    return 'visual';
                }
                // NORMAL MODE
                if (_mode === 'normal') {
                    // create a new row: enter => insert new row directly below selected row
                    if (lastAction.char === 'o' || lastAction.char === 'enter') {
                        newRow();
                        return 'insert';
                    }
                }

                // INSERT MODE
                if (_mode === 'insert') {
                    // Enter key opens a new row
                    if (lastAction.char === 'enter') {
                        newRow();
                        return _mode;
                    }
                    // write to row
                    setRows((oldRows) => {
                        const newRows = [...oldRows];
                        newRows[selectedRow] = {
                            text: getLegalText(newRows[selectedRow].text, lastAction.char),
                        };
                        return newRows;
                    });
                }
            }
            // Or keyup 
            else if (lastAction.event === 'up') {
            }
            return _mode;
        });
    }, [mem]);

    function newRow() {
        setRows((oldRows) => {
            const newRows = oldRows;
            newRows.splice(selectedRow+1, 0, { text: ' '})
            setSelectedRow((old) => old+1);
            return newRows;
        });
    }

    /* Cursor movement rules
     * right/left only possible if there is a textspace there
     * on up/down it keeps the same position if possible, if not it goes to the closest pos
     * it also needs to keep relative position so we need to cache that. TODO: What actions clear this?
     * TODO: on new line we should autoindent (this needs to be handled in @newRow() likely)
     */
    function updateCursorPos(type: string, row: Row, cachedPos: number) {
        const { text } = row;
        if (type === 'up' || type === 'down') {
            if (text.length >= cachedPos) return;
            setCursorPos(text.length-1);
        } else if (type === 'right' || type === 'left') {
            setCursorPos((oldPos) => {
                const potNewPos = type === 'right' ? oldPos+1 : oldPos-1;
                if (potNewPos >= 0 && potNewPos <= text.length-1) {
                    setCachedCursorPos(potNewPos);
                    return potNewPos;
                }
                return oldPos;
            });
        }
    }

    return (<>
    <h1>Vim</h1>
    <p>{ `mode: ${mode}` }</p>
    <EditorWrapper>
        { rows?.map((r, key) => <Line key={key} n={key+1} text={r.text} selected={selectedRow} cursorPos={cursorPos} setCursorPos={setCursorPos} />) }
        <Line key={'end'} n={0} text={''} selected={selectedRow} cursorPos={-1} setCursorPos={setCursorPos}/>
    </EditorWrapper>
    <p>{ `cursorPos: ${cursorPos} `}</p>
    <p>{ `selected: ${selectedRow}`}</p>
    <p>{ `mods: ${modifier}`}</p>
    <p>{ `code: ${code} ___ char: ${char} ___ event: ${event}` }</p>
    <p>{ `rows: ${rows.map((r, key) => `____ ${key+1}: ${r.text} ____`)}`}</p>
    <Col>{ mem.reverse().map(({ code, char, event}, i) => i > 10 ? null : <p>{`code: ${code} char: ${char} event: ${event}`}</p>)}</Col>
    </>);
}

const EditorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    padding: 5px;
    max-width: 500px;
`;

// THIS IS JUST FOR TEST
const Col = styled.div`
    display: flex;
    flex-direction: column;
`;
