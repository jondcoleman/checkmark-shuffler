import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileUploader } from './components/FileUploader';
import { TransposedTable } from './components/TransposedTable';
import { parseCSV, transposeData } from './utils/csvProcessor';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [data, setData] = useState(null);
  const [originalFileName, setOriginalFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file) => {
    setLoading(true);
    setOriginalFileName(file.name.replace('.csv', ''));
    try {
      const rawData = await parseCSV(file);
      const transposed = transposeData(rawData);
      // Simulate a little loading delay for the "processing" feel
      setTimeout(() => {
        setData(transposed);
        setLoading(false);
      }, 800); 
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Failed to parse CSV check format.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setOriginalFileName('');
  };

  const handleDownload = () => {
    if (!data) return;
    
    // Clean data for export: Replace "UNKNOWN" with blank strings
    const cleanData = data.map(row => 
      row.map(cell => (String(cell).toUpperCase() === 'UNKNOWN' ? '' : cell))
    );

    const csv = Papa.unparse(cleanData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${originalFileName}_transposed.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
             <Sparkles className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            Checkmark Shuffler
          </h1>
        </div>
        {data && (
           <div className="flex gap-2">
             <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 hover:bg-white text-gray-700 font-medium transition-all shadow-sm border border-transparent hover:border-gray-200"
             >
               <RefreshCw className="w-4 h-4" />
               <span className="hidden sm:inline">Reset</span>
             </button>
             <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-all shadow-lg hover:shadow-primary/25"
             >
               <Download className="w-4 h-4" />
               <span className="hidden sm:inline">Export CSV</span>
             </button>
           </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[95vw] md:max-w-7xl flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div 
               key="upload"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="flex-1 flex flex-col items-center justify-center min-h-[50vh]"
            >
               {loading ? (
                 <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">Shuffling bits...</p>
                 </div>
               ) : (
                  <>
                    <h2 className="text-4xl md:text-5xl font-black text-center text-gray-800 tracking-tight mb-4">
                      Turn your rows<br/>into columns.
                    </h2>
                    <p className="text-lg text-gray-500 text-center max-w-md mb-8">
                      Upload your habit tracking CSV and we'll pivot it into a beautiful daily view instantly.
                    </p>
                    <FileUploader onFileSelect={handleFileSelect} />
                  </>
               )}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 overflow-hidden h-full min-h-[600px]"
            >
               <TransposedTable data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400 text-sm p-4">
        &copy; {new Date().getFullYear()} Checkmark Shuffler. Built with ❤️.
      </footer>
    </div>
  );
}

export default App;
