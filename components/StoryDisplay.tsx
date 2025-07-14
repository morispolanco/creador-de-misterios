
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import Loader from './Loader';

interface StoryDisplayProps {
    story: string;
    isLoading: boolean;
    error: string | null;
    onExportWord: () => void;
    onExportAudio: () => void;
    isLoadingAudio: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, isLoading, error, onExportWord, onExportAudio, isLoadingAudio }) => {
    const isStoryFinished = !isLoading && story;

    // Extraer título (primera línea)
    const titleMatch = story.match(/^(.*?)\n/);
    const title = titleMatch ? titleMatch[1] : '';
    const storyBody = titleMatch ? story.substring(titleMatch[0].length) : story;

    const anyExportInProgress = isLoadingAudio;

    return (
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-4 -mr-4" style={{maxHeight: 'calc(100vh - 250px)'}}>
                {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
                
                {!isLoading && !story && !error && (
                    <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                        <p className="text-lg">Tu cuento aparecerá aquí...</p>
                        <p className="text-sm mt-2">Introduce una idea y presiona "Crear Cuento" para comenzar la magia.</p>
                    </div>
                )}
                
                {isLoading && !story && (
                     <div className="flex flex-col items-center justify-center h-full">
                        <Loader />
                        <p className="mt-4 text-gray-400 animate-pulse">Generando misterio...</p>
                    </div>
                )}
                
                {story && (
                    <article className="prose prose-invert prose-lg max-w-none font-serif text-gray-300">
                        {title && <h2 className="text-amber-400 !mb-6 text-center">{title}</h2>}
                        {storyBody.split('\n').map((paragraph, index) => (
                            <p key={index} className="text-justify leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </article>
                )}

                 {isLoading && story && (
                    <div className="flex items-center justify-center mt-4">
                        <Loader />
                        <p className="ml-3 text-gray-400 animate-pulse">El autor sigue escribiendo...</p>
                    </div>
                )}
            </div>
            {isStoryFinished && (
                <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-end items-center gap-4">
                     <button
                        onClick={onExportAudio}
                        disabled={anyExportInProgress}
                        className="w-full md:w-auto flex items-center justify-center px-5 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoadingAudio ? <Loader /> : <SpeakerWaveIcon className="h-5 w-5 mr-2" />}
                        Exportar a Audio
                    </button>
                    <button
                        onClick={onExportWord}
                        disabled={anyExportInProgress}
                        className="w-full md:w-auto flex items-center justify-center px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        <DownloadIcon className="h-5 w-5 mr-2" />
                        Exportar a Word
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoryDisplay;