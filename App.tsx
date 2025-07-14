
import React, { useState, useCallback } from 'react';
import { generateIdea, generateStoryStream, modifyStoryStream, generateAudio } from './services/geminiService';
import Header from './components/Header';
import Controls from './components/Controls';
import StoryDisplay from './components/StoryDisplay';
import { exportToWord, exportToWav } from './utils/exportUtils';

const App: React.FC = () => {
    const [idea, setIdea] = useState<string>('');
    const [story, setStory] = useState<string>('');
    const [isLoadingIdea, setIsLoadingIdea] = useState<boolean>(false);
    const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modificationRequest, setModificationRequest] = useState<string>('');
    const [isLoadingModification, setIsLoadingModification] = useState<boolean>(false);

    const handleGenerateIdea = useCallback(async () => {
        setIsLoadingIdea(true);
        setError(null);
        setStory(''); 
        setModificationRequest('');
        try {
            const newIdea = await generateIdea();
            setIdea(newIdea);
        } catch (err) {
            console.error(err);
            setError('Error al generar la idea. Por favor, inténtelo de nuevo.');
        } finally {
            setIsLoadingIdea(false);
        }
    }, []);

    const handleCreateStory = useCallback(async () => {
        if (!idea.trim()) {
            setError('Por favor, introduzca una idea para el cuento.');
            return;
        }
        setIsLoadingStory(true);
        setError(null);
        setStory('');
        setModificationRequest('');
        try {
            const stream = await generateStoryStream(idea);
            for await (const chunk of stream) {
                setStory((prevStory) => prevStory + chunk.text);
            }
        } catch (err) {
            console.error(err);
            setError('Error al generar el cuento. Por favor, inténtelo de nuevo.');
        } finally {
            setIsLoadingStory(false);
        }
    }, [idea]);

    const handleModifyStory = useCallback(async () => {
        if (!story.trim() || !modificationRequest.trim()) {
            setError('Asegúrate de que el cuento y la solicitud de modificación no estén vacíos.');
            return;
        }
        setIsLoadingModification(true);
        setError(null);
        const originalStoryForModification = story; // Preserve in case of error
        setStory(''); // Clear UI for loading indicator
        try {
            const stream = await modifyStoryStream(originalStoryForModification, modificationRequest);
            for await (const chunk of stream) {
                setStory(prev => prev + chunk.text);
            }
        } catch (err) {
            console.error(err);
            setError('Error al modificar el cuento. Por favor, inténtelo de nuevo.');
            setStory(originalStoryForModification); // Restore original story on error
        } finally {
            setIsLoadingModification(false);
            setModificationRequest(''); // Clear request after use
        }
    }, [story, modificationRequest]);


    const handleExportWord = useCallback(() => {
        if (!story) return;
        
        const titleMatch = story.match(/^(.*?)\n/);
        const title = titleMatch ? titleMatch[1].trim() : "Cuento de Misterio";
        
        exportToWord(story, title);
    }, [story]);

    const handleExportAudio = useCallback(async () => {
        if (!story) return;
        setIsLoadingAudio(true);
        setError(null);
        try {
            const titleMatch = story.match(/^(.*?)\n/);
            const title = titleMatch ? titleMatch[1].trim() : "Cuento de Misterio";
            const storyBody = titleMatch ? story.substring(titleMatch[0].length) : story;

            const audioData = await generateAudio(storyBody);
            exportToWav(audioData, title);

        } catch (err) {
             console.error(err);
             setError('Error al generar el audio. Por favor, inténtelo de nuevo.');
        } finally {
            setIsLoadingAudio(false);
        }
    }, [story]);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <Controls
                        idea={idea}
                        setIdea={setIdea}
                        onGenerateIdea={handleGenerateIdea}
                        onCreateStory={handleCreateStory}
                        isLoadingIdea={isLoadingIdea}
                        isLoadingStory={isLoadingStory}
                        isLoadingAudio={isLoadingAudio}
                        isLoadingModification={isLoadingModification}
                    />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                   <StoryDisplay
                        story={story}
                        setStory={setStory}
                        isLoading={isLoadingStory}
                        error={error}
                        onExportWord={handleExportWord}
                        onExportAudio={handleExportAudio}
                        isLoadingAudio={isLoadingAudio}
                        modificationRequest={modificationRequest}
                        setModificationRequest={setModificationRequest}
                        onModifyStory={handleModifyStory}
                        isLoadingModification={isLoadingModification}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;