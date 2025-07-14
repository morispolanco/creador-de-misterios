
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import Loader from './Loader';

interface StoryDisplayProps {
    story: string;
    setStory: (story: string) => void;
    isLoading: boolean;
    error: string | null;
    onExportWord: () => void;
    onExportAudio: () => void;
    isLoadingAudio: boolean;
    modificationRequest: string;
    setModificationRequest: (req: string) => void;
    onModifyStory: () => void;
    isLoadingModification: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ 
    story, 
    setStory, 
    isLoading, 
    error, 
    onExportWord, 
    onExportAudio, 
    isLoadingAudio,
    modificationRequest,
    setModificationRequest,
    onModifyStory,
    isLoadingModification
}) => {
    
    const isAnyLoading = isLoading || isLoadingModification || isLoadingAudio;
    const isStoryPresent = !isLoading && !isLoadingModification && story;
    const isAnyExportInProgress = isLoadingAudio;
    
    const displayHeight = 'calc(100vh - 300px)';

    return (
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl h-full flex flex-col">
            <div className="flex-grow flex flex-col" style={{ minHeight: displayHeight }}>
                {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md mb-4">{error}</div>}
                
                {(!isLoading && !isLoadingModification && !story && !error) && (
                    <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full flex-grow">
                        <p className="text-lg">Tu cuento aparecerá aquí...</p>
                        <p className="text-sm mt-2">Introduce una idea y presiona "Crear Cuento" para comenzar la magia.</p>
                    </div>
                )}
                
                {(isLoading && !story) && (
                     <div className="flex flex-col items-center justify-center h-full flex-grow">
                        <Loader />
                        <p className="mt-4 text-gray-400 animate-pulse">Generando misterio...</p>
                    </div>
                )}

                {isLoadingModification && (
                     <div className="flex flex-col items-center justify-center h-full flex-grow">
                        <Loader />
                        <p className="mt-4 text-gray-400 animate-pulse">Aplicando modificaciones...</p>
                    </div>
                )}
                
                {isStoryPresent && (
                     <textarea
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        className="w-full flex-grow bg-gray-800 border-0 focus:ring-0 focus:outline-none text-gray-300 resize-none font-serif text-lg leading-relaxed"
                        aria-label="Cuento generado"
                        disabled={isAnyLoading}
                    />
                )}

                 {isLoading && story && !isLoadingModification && (
                    <div className="flex items-center justify-center mt-4">
                        <Loader />
                        <p className="ml-3 text-gray-400 animate-pulse">El autor sigue escribiendo...</p>
                    </div>
                )}
            </div>
            
            {isStoryPresent && (
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-6">
                    <div className="space-y-3">
                        <label htmlFor="modification-request" className="text-lg font-semibold text-sky-400 flex items-center">
                           <SparklesIcon className="h-6 w-6 mr-2"/> Modificar el Cuento
                        </label>
                        <p className="text-sm text-gray-400">
                            Puedes editar el texto directamente arriba, o pedirle a la IA que haga cambios por ti.
                        </p>
                        <textarea
                            id="modification-request"
                            value={modificationRequest}
                            onChange={(e) => setModificationRequest(e.target.value)}
                            placeholder="Ej: Haz el final más irónico. Cambia el detective por una mujer llamada Isabel."
                            className="w-full h-28 p-3 bg-gray-900 border-2 border-gray-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 text-gray-200 resize-none"
                            disabled={isAnyLoading}
                        />
                        <button
                            onClick={onModifyStory}
                            disabled={isAnyLoading || !modificationRequest.trim()}
                            className="w-full flex items-center justify-center px-4 py-3 bg-sky-600 text-white font-bold rounded-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoadingModification ? <Loader /> : <SparklesIcon className="h-5 w-5 mr-2" />}
                            Aplicar Modificación con IA
                        </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-6 border-t border-gray-700/50">
                        <button
                            onClick={onExportAudio}
                            disabled={isAnyLoading || isAnyExportInProgress}
                            className="w-full md:w-auto flex items-center justify-center px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoadingAudio ? <Loader /> : <SpeakerWaveIcon className="h-5 w-5 mr-2" />}
                            Exportar a Audio
                        </button>
                        <button
                            onClick={onExportWord}
                            disabled={isAnyLoading || isAnyExportInProgress}
                            className="w-full md:w-auto flex items-center justify-center px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Exportar a Word
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryDisplay;
