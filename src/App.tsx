import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';


  const handleDownload = async () => {
    setLoading(true);
    const encodedUrl = encodeURIComponent(url);
  
    try {
      const response = await fetch(`${BASE_URL}/download?url=${encodedUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // Make sure to accept JSON if needed
        },
        mode: 'cors', // Ensure the mode is CORS
      });
      
      
      // Check if the response is not OK
      if (!response.ok) {
        throw new Error('Failed to download the file');
      }
  
      // Extract filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Content-Disposition:', contentDisposition);
  
      if (!contentDisposition) {
        throw new Error('Content-Disposition header is missing');
      }
  
      // Extract the filename from the content disposition
      const matches = /filename="([^"]*)"/.exec(contentDisposition);
      const filename = matches ? matches[1] : 'download.mp3'; // Default filename if none is provided
  
      // Create a blob from the response
      const blob = await response.blob();
      const urlBlob = URL.createObjectURL(blob);
  
      // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = filename; // Use the filename from the header or default
      a.click();
  
      // Clean up the object URL after download
      URL.revokeObjectURL(urlBlob);
  
      setUrl(''); // Clear input field after download
    } catch (error) {
      console.error(error);
      alert('An error occurred while downloading the file');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <div className='flex flex-col items-center justify-center h-full px-4'>
        <h1 className="text-center mb-5 text-2xl font-bold">Rizuka Miku YT MP3 Converter</h1>
        
        <div className="flex justify-center mb-3 w-full max-w-xl">
          <input
            type="text"
            placeholder="Insert URL"
            className="input input-bordered w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button
          className={`btn btn-primary mb-5 ${loading ? 'loading' : ''}`}
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? 'Downloading...' : 'Convert'}
        </button>
      </div>
    </div>
  );
}

export default App;
