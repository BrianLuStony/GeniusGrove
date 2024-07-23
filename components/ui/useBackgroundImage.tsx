import { useState, useEffect } from 'react';
import axios from 'axios';

const useBackgroundImage = (subject: string) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.pexels.com/v1/search?query=${subject}&per_page=10`, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
          },
        });

        if (response.data.photos && response.data.photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.photos.length);
          setBackgroundImage(response.data.photos[randomIndex].src.large);
        } else {
          setError('No images found for this subject');
        }
      } catch (error) {
        console.error('Failed to fetch background image', error);
        setError('Failed to fetch background image');
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundImage();
  }, [subject]);

  return { backgroundImage, loading, error };
};

export default useBackgroundImage;