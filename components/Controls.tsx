
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import Loader from './Loader';

interface ControlsProps {
    idea: string;
    setIdea: (idea: string) => void;
    onGenerateIdea: () => void;
    onCreateStory: () => void;
    isLoadingIdea: boolean;
    isLoadingStory: boolean;
    isLoadingAudio: boolean;
}

const Controls: React.FC<ControlsProps> = ({
    idea,
    setIdea,
    onGenerateIdea,
    onCreateStory,
    isLoadingIdea,
    isLoadingStory,
    isLoadingAudio
}) => {
    const isAnyLoading = isLoadingIdea || isLoadingStory || isLoadingAudio;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl h-full flex flex-col space-y-6 sticky top-24">
            <div className="flex-grow flex flex-col space-y-4">
                <label htmlFor="idea" className="text-lg font-semibold text-amber-400">
                    Tu Idea Inicial
                </label>
                <p className="text-sm text-gray-400">
                    Escribe la premisa de tu misterio o genera una automáticamente.
                </p>
                <textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ej: Un famoso chef es envenenado durante la final de un concurso de cocina, y todos los finalistas son sospechosos..."
                    className="w-full h-40 p-3 bg-gray-900 border-2 border-gray-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 text-gray-200 resize-none"
                    disabled={isAnyLoading}
                />
            </div>
            
            <div className="space-y-3">
                <button
                    onClick={onGenerateIdea}
                    disabled={isAnyLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                    {isLoadingIdea ? <Loader /> : <MagicWandIcon className="h-5 w-5 mr-2" />}
                    Generar Idea
                </button>
                <button
                    onClick={onCreateStory}
                    disabled={isAnyLoading || !idea.trim()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-amber-600 text-white font-bold rounded-md hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 text-lg"
                >
                    {isLoadingStory ? <Loader /> : <SparklesIcon className="h-6 w-6 mr-2" />}
                    Crear Cuento
                </button>
            </div>
        </div>
    );
};

export default Controls;