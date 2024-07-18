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
        const MAX_RESULTS = 3; // Number of videos to fetch
        console.log(topic, questions)
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${topic} ${questions}`,
                    type: 'video',
                    maxResults: MAX_RESULTS,
                    videoDuration: 'any',
                    key: API_KEY
                }
            });
            console.log(response.data.items);
            setVideos(response.data.items);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Failed to fetch videos. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Videos about {topic}</h2>
            <ul>
                {videos.map((video) => (
                    <li key={video.id.videoId}>
                        <h3>{video.snippet.title}</h3>
                        <p>{video.snippet.description}</p>
                        <p>Published: {new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
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
        </div>
    );
};

export default CustomVideo;