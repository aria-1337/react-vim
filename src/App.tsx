import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Line from './components/Line';

export default function App() {
    // Editor Logic
    const [rows, setRows] = useState([{ n: 1, text: 'some default text' }]);
    const [keypresses, setKeypresses] = useState<Array<number>>([]);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [cursorPos, setCursorPos] = useState<number>(0);

    useEffect(() => {
        // MOUNT
        document.addEventListener('keydown', (e) => {
            setKeypresses([...keypresses, e.keyCode]);
        });
        // UNMOUNT
        return () => {
            document.removeEventListener('keydown', () => {});
        }
    }, []);

    useEffect(() => {
        console.log(keypresses);
    }, [keypresses]);

    // @addLine()
    // This function created a new line is initially appended to the last Line instance.
    // It should be called during the following scenarios:
    // [] Enter press on keyboard -> Enters line @ n+1
    function addLine() {
    }

    return (<>
    <h1>Vim</h1>
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
