import React, { useCallback } from 'react';

// Actually I didn't install react-dropzone in the plan. I'll stick to native onDrop or add the package if needed. 
// Native is fine and lightweight.

import { Upload, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function FileUploader({ onFileSelect }) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-4">
      <motion.div
        layout
        className={cn(
          "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300",
          isDragging 
            ? "border-primary bg-primary/10 scale-102" 
            : "border-gray-300 hover:border-primary/50 hover:bg-white/50 bg-white/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center space-y-4 text-center p-6">
          <div className={cn(
            "p-4 rounded-full transition-all duration-500",
            isDragging ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white shadow-md text-gray-500 group-hover:text-primary group-hover:scale-110"
          )}>
            {isDragging ? <FileSpreadsheet className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-700">
              {isDragging ? "Drop it like it's hot!" : "Upload your Checkmarks CSV"}
            </h3>
            <p className="text-sm text-gray-500">
              Drag & drop or click to browse
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
