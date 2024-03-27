const shiftMods: { [key: string]: string }= {
    ';': ':',
}

export default function getModifiedChar(char: string, mods: Array<string>) : string {
    if (mods.includes('shift')) {
        const lookup = shiftMods?.[char];
        if (lookup) return lookup;
        return char.toUpperCase();
    }
    return char;
}
