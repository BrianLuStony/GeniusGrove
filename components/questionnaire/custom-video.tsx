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
        const MAX_RESULTS = 6; // Number of videos to fetch
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
        <div>
            <h1 style={{ fontSize: '3em' }}>Videos about {topic}</h1>
            <h3 style={{ fontSize: '1.5em', color: 'red' }}>*Please watch the videos on Youtube for a better experience</h3>
            <ul>
                {videos.map((video) => (
                    <li key={video.id.videoId}>
                        <h3>{video.snippet.title}</h3>
                        <p>{video.snippet.description}</p>
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
            <button onClick={fetchVideos}>Refresh Videos</button>
        </div>
    );
};

export default CustomVideo;
