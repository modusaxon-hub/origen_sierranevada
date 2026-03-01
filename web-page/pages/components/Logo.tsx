import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Mobile/Tablet: PNG Image for absolute visual guarantee */}
            <img
                src="/logo-completo.png"
                alt="Origen Sierra Nevada"
                className="block lg:hidden w-auto h-full object-contain"
            />

            {/* Desktop: Inline SVG for vector sharpness, using embedded fonts */}
            <svg
                id="Capa_1"
                data-name="Capa 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 535.03 89.12"
                className="hidden lg:block w-auto h-full"
            >
                <defs>
                    <style>
                        {`
                            .cls-1 { letter-spacing: 0em; }
                            .cls-2 { stroke-width: 4px; }
                            .cls-2, .cls-3 { stroke: #cabe75; stroke-miterlimit: 10; }
                            .cls-2, .cls-3, .cls-4 { fill: #cabe75; }
                            .cls-3 {
                                font-family: 'Papyrus', fantasy;
                                font-size: 24.51px;
                                stroke-width: .75px;
                            }
                            .cls-4 {
                                font-family: 'Playfair Display', serif;
                                font-size: 47.36px;
                                font-weight: 900;
                            }
                            .cls-5 { letter-spacing: 0em; }
                        `}
                    </style>
                </defs>
                <text className="cls-4" transform="translate(301 40.44) scale(1.23 1)">
                    <tspan className="cls-1" x="0" y="0">O</tspan>
                    <tspan x="37.98" y="0">R</tspan>
                    <tspan className="cls-5" x="71.42" y="0">I</tspan>
                    <tspan x="89.46" y="0">GEN</tspan>
                </text>
                <g>
                    <path className="cls-2" d="M159.69,19.09c-2.13-2.43-6.04-6.75-8.84-8.45-1.9-1.15-5.63,1.79-7.24,2.89-8.37,5.69-15.05,13.62-23,19.6-2.68,2.01-4.59,2.48-7.34,3.98-4.34,2.35-10.26,10.86-14.83,11.24-3.39.29-5.46-2.09-7.91-4.03-5.83-4.62-8.23-8.44-16.06-3.38-5.07,3.28-9.78,8.31-14.49,12.14-15.16,12.29-33.53,23.97-53.97,25.94-.53.05-3.33.3-3.51.17-.51-.35-.23-1.62-.29-2.17,15.67-.67,30.2-7.35,42.78-15.7,9.49-6.3,16.9-13.89,25.78-20.41,6.46-4.74,10.45-6.49,17.61-1.43,1.79,1.27,7.63,6.98,9.13,7.04,2.97.11,7.41-5.52,9.42-7.34,4-3.61,8.44-4.93,12.63-8.16,6.69-5.15,12.57-11.58,19.31-16.77,2.6-2,7.89-6.35,11.33-5.85,4.05.59,9.74,8.08,13.16,10.55,2.65,1.91,4.66,2.11,7.48,3.27,4.33,1.79,8.2,6.61,11.49,9.81,2.7,2.63,7.83,8.64,11.11,10.03.54.89,1.93,1.82,3.1,2.1,9.6,2.34,10.38-9.9,20.92-7.12,4.69,1.24,14.47,12.29,18.69,15.92,13.38,11.56,29.38,19.93,47.15,23.77l10.58.92c1.54,2-.29,2.06-2.08,1.96-21.41-1.22-42.01-11.69-57.47-25.22-4.39-3.83-8.32-8.77-12.75-12.34-7.19-5.78-10.62-2.95-16.28,2.43-15.25,14.5-36.81,38.88-61.23,35.4-.66-.1-1.57-.42-1.35-1.22.35-1.27,1.99-.48,2.84-.47,17.87.28,31.14-10.09,43.51-20.93,2.34-2.05,9.14-7.92,10.6-10.07,1.18-1.74-1.71-.97-2.98-1.15-2.58-.37-4.31-1.4-6.27-2.98-3.56-2.88-6.93-7.65-10.64-9.89-.86-2-6.92-7.79-9.12-8.74-1.79-.77-3.57-.77-5.48-1.72-2.11-1.04-3.32-2.67-5.47-3.59h-.02Z" />
                    <path className="cls-2" d="M123.52,73.59c.09-.21,3.23-2.34,3.81-2.86,5.74-5.21,5.56-8.72,8.3-15.11,1.63-3.81,5.08-8.37,8.42-10.98.64-.5,3.35-2.71,4.09-2.01,1.19,1.12-3.88,4.3-4.71,5.16-5.21,5.35-4.74,11.72-8.42,17.58-1.59,2.53-7.13,8.23-9.98,9.22-.85.3-1.94,0-1.51-1h0Z" />
                </g>
                <text className="cls-3" transform="translate(304.2 75.97) scale(.85 1)">
                    <tspan x="0" y="0">SIERRA   NEVADA</tspan>
                </text>
            </svg>
        </div>
    );
};

export default Logo;
