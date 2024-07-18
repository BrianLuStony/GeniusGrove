import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CustomVideoProps {
    topic: string;
    questions: string;
}

interface Video {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: { default: { url: string } };
    };
}

const CustomVideo: React.FC<CustomVideoProps> = ({ topic, questions }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVideos();
    }, [topic, questions]);

    const fetchVideos = async () => {
        setLoading(true);
        setError(null);
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // Replace with your actual API key
        const MAX_RESULTS = 6; // Fetch more videos to shuffle
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${topic} ${questions} English`,
                    type: 'video',
                    maxResults: MAX_RESULTS,
                    videoDuration: 'medium',
                    key: API_KEY
                }
            });
            console.log(response.data.items);
            setVideos(shuffleArray(response.data.items).slice(0, 3)); // Shuffle and select 3 videos
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Failed to fetch videos. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array: Video[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Videos about {topic}</h1>
            <h3 className="text-xl text-red-500 mb-4">*Please watch the videos on Youtube for a better experience</h3>
            <ul className="space-y-4">
                {videos.map((video) => (
                    <li key={video.id.videoId} className="border rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-semibold">{video.snippet.title}</h3>
                        <p className="text-gray-700">{video.snippet.description}</p>
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${video.id.videoId}`}
                            title={video.snippet.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </li>
                ))}
            </ul>
            <button
                onClick={fetchVideos}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
                Refresh Videos
            </button>
        </div>
    );
};

export default CustomVideo;
