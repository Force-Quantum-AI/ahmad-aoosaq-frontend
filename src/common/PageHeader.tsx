import React from 'react';
import { RefreshCw, Save } from 'lucide-react';

const PageHeader = ({
    children,           // Left side content (Title, subtitles, links)
    actionRows = [],    // Array of React nodes, each representing a row of buttons
    onRefresh,
    onSave,
    showDefaultActions = true,
    className = ""
}: {
    children: React.ReactNode;
    actionRows?: React.ReactNode[];
    onRefresh?: () => void;
    onSave?: () => void;
    showDefaultActions?: boolean;
    className?: string;
}) => {
    return (
        <div className={`flex flex-col md:flex-row justify-between items-start gap-6 mb-10 ${className}`}>

            {/* Left Side Container: Content & Text */}
            <div className="flex-1 w-full md:w-auto">
                {children}
            </div>

            {/* Right Side Container: Action Rows */}
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                {/* Map through additional rows of buttons (Test Agent, New Agent, etc.) */}
                {actionRows.map((row, index) => (
                    <div key={index} className="flex items-center gap-2 flex-wrap justify-start md:justify-end w-full">
                        {row}
                    </div>
                ))}

                {/* The Constant Row: Refresh and Save Changes */}
                {showDefaultActions && (
                    <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end w-full">
                        <button
                            onClick={onRefresh}
                            className="w-full md:w-fit flex items-center justify-center md:justify-start gap-2 bg-[#121212] hover:bg-[#1a1a1a] text-gray-300 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                        {/* <button
                            onClick={onSave}
                            className="w-full md:w-fit flex items-center justify-center md:justify-start gap-2 bg-[#2D3243] hover:bg-[#383e53] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-lg"
                        >
                            <Save size={16} />
                            Save Changes
                        </button> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;