import React, { useState } from 'react';
import { Loader2, Send, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface GenerateResponse {
  data?: {
    image_url?: string;
    binary_data_base64?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);
    setDebugInfo(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setDebugInfo(JSON.stringify(data, null, 2));

      // Attempt to parse Volcengine response structure
      // Usually it's in data.binary_data_base64 (array) or data.image_url
      if (data.data && data.data.binary_data_base64 && data.data.binary_data_base64.length > 0) {
        setImageUrl(`data:image/png;base64,${data.data.binary_data_base64[0]}`);
      } else if (data.data && data.data.image_url) {
        setImageUrl(data.data.image_url);
      } else {
        // Fallback: check if the response itself has image_url or similar
        console.warn('Unexpected response structure:', data);
        setError('Image generated but response format is unrecognized. Check debug info.');
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Jimeng AI Image Generator
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Powered by Volcano Engine
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleGenerate}>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                Enter your prompt
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="prompt"
                  rows={4}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                  placeholder="A cyberpunk city with neon lights..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {imageUrl && (
            <div className="mt-8">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Result</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full h-auto rounded-md shadow-lg"
                />
              </div>
            </div>
          )}

          {debugInfo && (
            <div className="mt-8">
              <details>
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Debug Info (API Response)
                </summary>
                <pre className="mt-2 bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-60">
                  {debugInfo}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
