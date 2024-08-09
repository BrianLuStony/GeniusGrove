import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        thumbnails: { medium: { url: string } };
    };
    statistics?: {
        viewCount: string;
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
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const MAX_RESULTS = 20; // Fetch more videos to have a larger pool for filtering

        try {
            // Initial search request
            const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(`${topic} ${questions} for kids educational`)}&type=video&maxResults=${MAX_RESULTS}&videoDuration=medium&videoEmbeddable=true&key=${API_KEY}`);
            
            if (!searchResponse.ok) {
                throw new Error('Failed to fetch videos');
            }

            const searchData = await searchResponse.json();
            
            // Filter videos
            const filteredVideos = searchData.items;
            // filter((video: Video) => 
            //     // video.snippet.title.toLowerCase().includes('kid') ||
            //     // video.snippet.title.toLowerCase().includes('children') ||
            //     video.snippet.description.toLowerCase().includes('educational')
            // );

            // Fetch video details including view count
            const videoIds = filteredVideos.map((video: Video) => video.id.videoId).join(',');
            const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`);
            
            if (!detailsResponse.ok) {
                throw new Error('Failed to fetch video details');
            }

            const detailsData = await detailsResponse.json();

            // Combine search results with video details
            const videosWithStats = filteredVideos.map((video: Video) => {
                const stats = detailsData.items.find((item: any) => item.id === video.id.videoId);
                return {
                    ...video,
                    statistics: stats ? stats.statistics : null
                };
            });

            // Sort by view count and take top 3
            const sortedVideos = videosWithStats
                .sort((a: Video, b: Video) => {
                    const aViews = a.statistics ? parseInt(a.statistics.viewCount) : 0;
                    const bViews = b.statistics ? parseInt(b.statistics.viewCount) : 0;
                    return bViews - aViews;
                })
                .slice(0, 3);

            setVideos(sortedVideos);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Oops! We couldn\'t find any videos right now. Let\'s try again later!');
        } finally {
            setLoading(false);
        }
    };

    const formatViewCount = (count: string) => {
        const num = parseInt(count);
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    if (loading) return <div className="text-center p-4">Loading fun videos for you...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Popular Videos about {topic}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <Card key={video.id.videoId} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <img 
                                src={video.snippet.thumbnails.medium.url} 
                                alt={video.snippet.title}
                                className="w-full h-48 object-cover"
                            />
                        </CardHeader>
                        <CardContent className="p-4">
                            <CardTitle className="text-lg mb-2">{video.snippet.title}</CardTitle>
                            <p className="text-sm text-gray-600 line-clamp-2">{video.snippet.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Eye className="mr-1 h-4 w-4" />
                                {video.statistics ? formatViewCount(video.statistics.viewCount) : 'N/A'} views
                            </div>
                            <a 
                                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Watch on YouTube
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="text-center">
                <Button onClick={fetchVideos} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    <RefreshCw className="mr-2 h-4 w-4" /> Find More Popular Videos
                </Button>
            </div>
        </div>
    );
};

export default CustomVideo;