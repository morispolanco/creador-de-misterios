
import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-center text-center">
                <BookOpenIcon className="h-8 w-8 mr-4 text-amber-400" />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                        Creador de Misterios
                    </h1>
                    <p className="text-sm text-gray-400">Tu generador de suspense e intriga</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
