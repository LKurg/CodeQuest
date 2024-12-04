import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGE_VERSION } from "../constants";

const languages = Object.entries(LANGUAGE_VERSION);

const LanguageSelector = ({ onLanguageChange }) => {
    return (
        <div className="mb-2">
            <select 
                className="w-full p-2 border rounded bg-white"
                onChange={(e) => onLanguageChange(e.target.value)}
            >
                {languages.map(([key, value]) => (
                    <option key={key} value={key}>{key}</option>
                ))}
            </select>
        </div>
    );
};
export default LanguageSelector;