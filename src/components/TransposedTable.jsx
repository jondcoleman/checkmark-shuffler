import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Circle, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper to format date header "2025-12-30" -> "TUE 30"
const formatDateHeader = (dateStr) => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    
    // Day name
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = date.getDate();
    return (
      <div className="flex flex-col items-center justify-center leading-none">
        <span className="text-[9px] font-bold text-gray-400 mb-0.5">{dayName}</span>
        <span className="text-xs font-bold text-gray-700">{dayNum}</span>
      </div>
    );
  } catch (e) {
    return dateStr;
  }
};

const CellValue = ({ value, rowHeader }) => {
  // Normalize value
  const valString = String(value).trim();
  const valUpper = valString.toUpperCase();

  // YES logic
  if (valUpper === 'YES_MANUAL' || valUpper === 'YES_AUTO') {
    return <Check className="w-4 h-4 text-primary stroke-[3]" />;
  }
  
  // NO / UNKNOWN logic
  if (valUpper === 'NO') {
    return <X className="w-3 h-3 text-gray-300" />;
  }
  
  if (valUpper === 'UNKNOWN' || valUpper === '') {
     return <div className="w-1 h-1 rounded-full bg-gray-100" />;
  }

  // Numeric formatting for specific rows
  const isSleepGoal = rowHeader.toLowerCase().includes('sleep goal');
  const isSleepScore = rowHeader.toLowerCase().includes('sleep score');
  const isSteps = rowHeader.toLowerCase().includes('steps');

  if (isSleepGoal || isSleepScore || isSteps) {
    const num = parseFloat(valString);
    if (!isNaN(num)) {
       let displayVal = num / 1000;
       let unit = '';
       let decimals = 0;

       if (isSleepGoal) {
          unit = 'hours';
          decimals = 2;
          // Strip trailing zeros if needed? Screenshot shows 5.32, 4.57. 
          // 0 -> 0.
          // Screenshot shows "0 hours" for 0 value.
          // Screenshot shows "5.32 hours".
       } else if (isSteps) {
          // Screenshot: 6.4, 4.9.
          decimals = 1;
       } else if (isSleepScore) {
          // Screenshot: 82, 80.
          decimals = 0;
       }
       
       // Handle formatting
       let formatted = displayVal.toFixed(decimals);
       // Optional: remove .0 for steps if it's an integer? 
       // Screenshot steps: 6.4, 4.9, 5.5.
       // Screenshot sleep score: 82, 80.
       // Screenshot sleep goal: 0 (displays as 0 hours). 0.00? Image shows just "0".
       // Let's do simple cleaning: if the decimal part is 00 and we want to allow integers, we might strip it, 
       // but user screenshot for Sleep Goal clearly shows "0" not "0.00".
       // For "5.32", it keeps decimals.
       
       if (displayVal === 0) {
         formatted = "0";
       } else {
         // remove trailing zeros if it's just an integer disguised as decimal?
         // Actually 6.4 implies one decimal. 82 implies zero.
         // Stick to toFixed unless 0.
       }

       const isZero = displayVal === 0;
       const textColor = isZero ? "text-gray-200" : "text-gray-600";
       const subTextColor = isZero ? "text-gray-200" : "text-gray-400";

       return (
        <div className="flex flex-col items-center leading-none">
            <span className={cn("text-[11px] font-bold", textColor)}>
              {formatted}
            </span>
            {unit && (
              <span className={cn("text-[9px] font-medium -mt-0.5", subTextColor)}>
                {unit}
              </span>
            )}
        </div>
      );
    }
  }
  
  // Default fallback
  return <span className="text-[10px] font-semibold text-gray-400 truncate max-w-[40px] block" title={value}>{value}</span>;
};

export function TransposedTable({ data }) {
  if (!data || data.length === 0) return null;

  const header = data[0]; // ["Habits", "2025-12-30", ...]
  const rows = data.slice(1);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col bg-white/40 backdrop-blur-sm rounded-xl shadow-2xl border border-white/50">
      {/* Table Container */}
      <div className="overflow-auto relative flex-1">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-white/90 backdrop-blur sticky top-0 z-20 shadow-sm">
               {/* First Header Cell (Habits Label) - Sticky Left + Top */}
               <th className="p-2 w-[180px] min-w-[180px] sticky left-0 z-30 bg-white/95 backdrop-blur-md border-b border-r border-gray-100/50 font-bold text-sm text-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                 {header[0]}
               </th>
               {/* Date Headers */}
               {header.slice(1).map((date, i) => (
                 <th key={i} className="p-1 w-[36px] min-w-[36px] text-center border-b border-gray-100/50 bg-white/50">
                    {formatDateHeader(date)}
                 </th>
               ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="group hover:bg-white/40 transition-colors border-b border-gray-100/30 last:border-0 h-[36px]"
              >
                {/* Habit Name - Sticky Left */}
                <td className="p-2 sticky left-0 z-10 bg-white/80 group-hover:bg-white/95 backdrop-blur-sm border-r border-gray-100/50 font-medium text-gray-700 text-xs md:text-sm truncate shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                     <span title={row[0]}>{row[0]}</span>
                </td>
                
                {/* Values */}
                {row.slice(1).map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-0 text-center border-l border-gray-50/50">
                    <div className="flex items-center justify-center w-full h-full">
                        <CellValue value={cell} rowHeader={row[0]} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
