const noteMap = [
    [16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87],
    [32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74],
    [65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.8, 110.0, 116.5, 123.5],
    [130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196.0, 207.7, 220.0, 233.1, 246.9],
    [261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370.0, 392.0, 415.3, 440.0, 466.2, 493.9],
    [523.3, 554.4, 587.3, 622.3, 659.3, 698.5, 740.0, 784.0, 830.6, 880.0, 932.3, 987.8],
    [1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976],
    [2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951],
    [4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902],
]

const scaleMap: { [key: string]: number}[] = [
    { 'C': 0 },
    { 'C#': 1 },
    { 'D': 2 },
    { 'Eb': 3 },
    { 'E': 4 },
    { 'F': 5 },
    { 'F#': 6 },
    { 'G': 7 },
    { 'G#': 8 },
    { 'A': 9 },
    { 'Bb': 10 },
    { 'B': 11 },
];

function getFrequency(octave: number, note: number) {
    if (octave >= 0 && octave <= 8 ) {
        if (note >= 0 && note <= 11 ) {
            return noteMap[octave][note];
        }
    }
    return 0;
}

function parseOctave(sound: string) {
    return +sound.split(/(\d+)/)[1];
}

function parseNote(sound: string) {
    const letter = sound.split(/(\d+)/)[0];
    return scaleMap.findIndex(note => {
        let includes = Object.keys(note).includes(letter.toUpperCase());
        return includes;
    });
}

function play(sound: string, type: OscillatorType = "sine", duration: number = 2) {
    const context = new AudioContext();
    const osc = context.createOscillator();
    const gainNode = context.createGain();

    const frequency = getFrequency(
        parseOctave(sound),
        parseNote(sound)
    );
    osc.frequency.value = frequency;
    osc.type = type;
    osc.start(0);
    osc.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);
    setTimeout(() => {
        context.close();
    }, duration * 1000);
}

export {
    play,
}