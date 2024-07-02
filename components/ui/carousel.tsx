
import { useEffect,useState } from "react";
export interface CarouselItem {
    content: string;
}

export const Carousel: React.FC<{ items: CarouselItem[] }> = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
            setIsTransitioning(false);
        }, 500); // Half of the transition duration
        }, 8000);

        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="relative overflow-hidden h-48 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg">
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-2xl font-semibold">{items[currentIndex].content}</p>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                    onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentIndex(index);
                        setIsTransitioning(false);
                    }, 500);
                    }}
                />
                ))}
            </div>  
        </div>
    );
};