const illegal : { [key: string] : boolean } = {
    'up': true,
    'down': true,
    'esc': true,
};

const legal : { [key: string] : string } = {
    'space': ' ',
}

export default function getLegalText(char: string) : string {
    // Skip characters that we dont want to write
    if (illegal[char]) {
        return '';
    }
    if (legal[char]) {
        return legal[char];
    }
    return char;
}
