/**
 * Exporta un texto a un archivo .doc (HTML-based) que Word puede abrir.
 * @param textContent El contenido del cuento.
 * @param filename El nombre del archivo sin extensión.
 */
export const exportToWord = (textContent: string, filename: string): void => {
    // Extraer cuerpo de la historia (todo excepto la primera línea/título)
    const titleEndIndex = textContent.indexOf('\n');
    const storyBody = titleEndIndex !== -1 ? textContent.substring(titleEndIndex + 1) : '';

    // Reemplaza saltos de línea con párrafos de HTML para el cuerpo
    const paragraphs = storyBody.split('\n').filter(p => p.trim() !== '').map(p => `<p style="margin-bottom: 1em; text-align: justify;">${p}</p>`).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 12pt;
                    line-height: 1.5;
                }
                h1 {
                    font-size: 16pt;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 2em;
                }
                p {
                    margin-bottom: 1em;
                    text-align: justify;
                }
            </style>
        </head>
        <body>
            <h1>${filename}</h1>
            ${paragraphs}
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/ /g, '_')}.doc`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


/**
 * Exporta datos de audio PCM en base64 a un archivo .wav.
 * @param base64PcmData Los datos de audio PCM codificados en base64.
 * @param filename El nombre del archivo sin extensión.
 */
export const exportToWav = (base64PcmData: string, filename: string): void => {
    const pcmData = atob(base64PcmData);
    const pcmDataArray = new Uint8Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        pcmDataArray[i] = pcmData.charCodeAt(i);
    }

    const wavHeader = createWavHeader(pcmDataArray.length);
    const wavBlob = new Blob([wavHeader, pcmDataArray], { type: 'audio/wav' });
    const url = URL.createObjectURL(wavBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/ /g, '_')}.wav`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

function createWavHeader(dataLength: number): ArrayBuffer {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);

    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    // RIFF identifier
    view.setUint8(0, 'R'.charCodeAt(0));
    view.setUint8(1, 'I'.charCodeAt(0));
    view.setUint8(2, 'F'.charCodeAt(0));
    view.setUint8(3, 'F'.charCodeAt(0));
    // RIFF chunk length
    view.setUint32(4, 36 + dataLength, true);
    // RIFF type
    view.setUint8(8, 'W'.charCodeAt(0));
    view.setUint8(9, 'A'.charCodeAt(0));
    view.setUint8(10, 'V'.charCodeAt(0));
    view.setUint8(11, 'E'.charCodeAt(0));
    // FMT identifier
    view.setUint8(12, 'f'.charCodeAt(0));
    view.setUint8(13, 'm'.charCodeAt(0));
    view.setUint8(14, 't'.charCodeAt(0));
    view.setUint8(15, ' '.charCodeAt(0));
    // FMT chunk length
    view.setUint32(16, 16, true);
    // Audio format (PCM)
    view.setUint16(20, 1, true);
    // Number of channels
    view.setUint16(22, numChannels, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate
    view.setUint32(28, byteRate, true);
    // Block align
    view.setUint16(32, blockAlign, true);
    // Bits per sample
    view.setUint16(34, bitsPerSample, true);
    // DATA identifier
    view.setUint8(36, 'd'.charCodeAt(0));
    view.setUint8(37, 'a'.charCodeAt(0));
    view.setUint8(38, 't'.charCodeAt(0));
    view.setUint8(39, 'a'.charCodeAt(0));
    // DATA chunk length
    view.setUint32(40, dataLength, true);

    return buffer;
}