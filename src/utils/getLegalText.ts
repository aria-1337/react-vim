const illegal : { [key: string] : boolean } = {
    'up': true,
    'down': true,
    'esc': true,
};

const legal : { [key: string] : string } = {
    'space': ' ',
}

export default function getLegalText(oldText: string, char: string) : string {
    // Backspace events
    if (char === 'backspace') {
        return oldText.slice(0, oldText.length-1);
    }

    // Skip characters that we dont want to write
    if (illegal[char]) {
        return oldText + '';
    }
    if (legal[char]) {
        return oldText + legal[char];
    }
    return oldText + char;
}
