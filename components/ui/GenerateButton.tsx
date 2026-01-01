'use client';

import { Loader2 } from 'lucide-react';

interface GenerateButtonProps {
    isLoading: boolean;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

export function GenerateButton({
    isLoading,
    disabled,
    className = "",
    onClick,
    type = "submit"
}: GenerateButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                Btn-Container relative flex w-[170px] h-fit bg-[#1d2129] rounded-[40px] 
                shadow-[0px_5px_10px_rgba(0,0,0,0.5)] justify-between items-center border-none cursor-pointer
                transition-all duration-300
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                ${className}
            `}
        >
            <span className="text w-[calc(170px-45px)] h-full flex items-center justify-center text-white text-[1.1em] tracking-[1.2px]">
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    "Generate"
                )}
            </span>

            <span className="icon-Container w-[45px] h-[45px] bg-[#f59aff] flex items-center justify-center rounded-full border-[3px] border-[#1d2129]">
                <svg
                    width="16"
                    height="19"
                    viewBox="0 0 16 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="arrow-icon transition-all duration-1500"
                >
                    <circle cx="1.61321" cy="1.61321" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="1.61321" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="5.5566" r="1.5" fill="black"></circle>
                    <circle cx="9.85851" cy="5.5566" r="1.5" fill="black"></circle>
                    <circle cx="9.85851" cy="9.5" r="1.5" fill="black"></circle>
                    <circle cx="13.9811" cy="9.5" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="13.4434" r="1.5" fill="black"></circle>
                    <circle cx="9.85851" cy="13.4434" r="1.5" fill="black"></circle>
                    <circle cx="1.61321" cy="17.3868" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="17.3868" r="1.5" fill="black"></circle>
                </svg>
            </span>

            <style jsx>{`
                .Btn-Container:hover .arrow-icon {
                    animation: arrow 1s linear infinite;
                }
                @keyframes arrow {
                    0% {
                        opacity: 0;
                        margin-left: 0px;
                    }
                    100% {
                        opacity: 1;
                        margin-left: 10px;
                    }
                }
            `}</style>
        </button>
    );
}
