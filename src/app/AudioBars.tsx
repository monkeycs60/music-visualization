import { useRef } from 'react';

type AudioBarsProps = {
  data: number[];
  width: number;
};

const AudioBars = ({ data, width }: AudioBarsProps) => {
   const gradientRef = useRef<SVGLinearGradientElement>(null);

   const barWidth = 8;
   const barSpacing = 2;

   return (
      <svg
         width={width}
         height="100"
         viewBox={`0 0 ${width} 100`}
         preserveAspectRatio="none"
      >
         <defs>
            <linearGradient
               ref={gradientRef}
               id="bars-gradient"
               gradientUnits="userSpaceOnUse"
               x1="0"
               y1="0"
               x2="0"
               y2="100"
            >
               <stop offset="0" stopColor="rgb(246,156,242)" stopOpacity="1" />
               <stop offset="1" stopColor="rgb(18,236,246)" stopOpacity="1" />
            </linearGradient>
         </defs>
         {data.map((value, index) => (
            <rect
               key={index}
               x={index * (barWidth + barSpacing)}
               y={100 - (value / 255) * 80}
               width={barWidth}
               height={(value / 255) * 100}
               fill="url(#bars-gradient)"
            />
         ))}
      </svg>
   );
};

export default AudioBars;