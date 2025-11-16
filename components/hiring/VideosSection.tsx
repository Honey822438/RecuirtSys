import React, { useRef } from 'react';

interface VideosSectionProps {
  videos: string[];
  onUpdateVideos: (videos: string[]) => void;
}

const VideosSection: React.FC<VideosSectionProps> = ({ videos, onUpdateVideos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // In a real app, you'd upload the file and get a URL.
      // Here, we just add the filename to simulate the upload.
      onUpdateVideos([...videos, file.name]);
    }
  };

  const handleEmailVideos = () => {
    if (videos.length === 0) {
      alert("No videos to email.");
      return;
    }
    const subject = "Candidate Introduction Videos";
    const body = `Please find the candidate's introduction videos linked below:\n\n${videos.map(v => `- /uploads/${v}`).join('\n')}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Videos ({videos.length})</h3>
            <div className="flex gap-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="video/*" 
                />
                <button onClick={handleUploadClick} className="text-sm font-medium text-primary-600 hover:text-primary-800">Upload Video</button>
                <button onClick={handleEmailVideos} className="text-sm font-medium text-primary-600 hover:text-primary-800">Email Videos</button>
            </div>
        </div>
        
        {videos.length > 0 ? (
            <ul className="space-y-2">
                {videos.map((video, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <span className="text-sm text-gray-700 truncate">{video}</span>
                        <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Play</a>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-sm text-gray-500 py-4">No videos have been uploaded for this candidate.</p>
        )}
    </div>
  );
};

export default VideosSection;