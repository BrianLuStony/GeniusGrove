'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { incrementSubjectVisits } from '@/db';
import CustomVideo from '../questionnaire/custom-video';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SubjectPageProps, ExplanationSection, subjectTopics } from './types';
import Cookies from 'js-cookie';

const TopicExplanation: React.FC<{ explanation: string; fontSize: number }> = ({ explanation, fontSize }) => {
  const parseExplanation = (text: string): ExplanationSection[] => {
    const lines = text.split('\n');
    const sections: ExplanationSection[] = [];
    let currentSection: ExplanationSection | null = null;

    lines.forEach(line => {
      if (line.startsWith('#')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.replace('#', '').trim(), content: [] };
      } else if (line.trim() !== '') {
        if (currentSection) {
          currentSection.content.push(line.trim());
        } else {
          currentSection = { title: 'Let\'s Learn!', content: [line.trim()] };
        }
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseExplanation(explanation);

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg border-2 border-yellow-300" style={{ fontSize: `${fontSize}px` }}>
          <h3 className="text-lg font-bold mb-2 text-blue-600">{section.title}</h3>
          {section.content.map((paragraph, pIndex) => (
            <ReactMarkdown key={pIndex} className="mb-2 text-gray-800">{paragraph}</ReactMarkdown>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function SubjectPage({ subjectName, subjectId }: SubjectPageProps) {
  const [topicExplanations, setTopicExplanations] = useState<Record<string, string>>({});
  const [detailedExplanations, setDetailedExplanations] = useState<Record<string, string[]>>({});
  const [detailLevels, setDetailLevels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [loadingDetailed, setLoadingDetailed] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState(18); // Increased default font size for better readability
  const topics = subjectTopics[subjectName] || [];

  useEffect(() => {
    const updateVisits = async () => {
      // ... [visit tracking logic remains unchanged]
    };

    updateVisits();
  }, [subjectId]);

  const fetchTopicExplanation = async (topic: string) => {
    if (topicExplanations[topic]) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/api/chat', { 
        prompt: `Explain ${topic} in ${subjectName} to a 10-year-old child. Use simple words, fun examples, and maybe a joke or two. Format with Markdown, use emojis, and keep it short and exciting!` 
      });
      setTopicExplanations(prev => ({ ...prev, [topic]: response.data.response }));
    } catch (error) {
      console.error('Oops! We couldn\'t fetch the explanation.', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedExplanation = async (topic: string) => {
    setLoadingDetailed(prev => ({ ...prev, [topic]: true }));
    const currentLevel = detailLevels[topic] || 0;
    const newLevel = currentLevel + 1;

    try {
      const response = await axios.post('/api/chat', { 
        prompt: `Give a level ${newLevel} explanation of ${topic} in ${subjectName} for a curious kid who wants to learn more. Use fun facts, simple experiments they can try at home, and relate it to things they know. Keep it exciting and use emojis!`
      });
      
      setDetailedExplanations(prev => ({
        ...prev,
        [topic]: [...(prev[topic] || []), response.data.response]
      }));
      
      setDetailLevels(prev => ({
        ...prev,
        [topic]: newLevel
      }));
    } catch (error) {
      console.error('Oops! We couldn\'t get more details.', error);
    } finally {
      setLoadingDetailed(prev => ({ ...prev, [topic]: false }));
    }
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6" style={{ fontFamily: 'Comic Sans MS, cursive', backgroundColor: '#f0f8ff' }}>
      <h1 className="font-bold text-2xl md:text-4xl text-purple-600 mb-8">Let's Learn About {subjectName}! 🎉</h1>
      <div className="flex justify-between mb-4">
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-full mr-2 hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
        >
          Make Text Smaller 🔍
        </button>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          onClick={() => setFontSize(prev => Math.min(prev + 2, 28))}
        >
          Make Text Bigger 🔎
        </button>
      </div>
      <Accordion type="single" collapsible className="w-full mt-8">
        {topics.map((topic, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="bg-blue-100 hover:bg-blue-200 p-4 rounded-t-lg font-bold text-lg text-blue-700" onClick={() => fetchTopicExplanation(topic)}>
              {topic} 🚀
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4 rounded-b-lg">
              {loading && topicExplanations[topic] === undefined ? (
                <p className="text-center text-xl">Loading... Hold on tight! 🌟</p>
              ) : (
                <div>
                  <TopicExplanation 
                    explanation={topicExplanations[topic] || ''} 
                    fontSize={fontSize}
                  />
                  {detailedExplanations[topic] && detailedExplanations[topic].map((explanation, idx) => (
                    <div key={idx} className="mt-4">
                      <h4 className="text-lg font-bold mb-2 text-purple-600">Cool Facts (Level {idx + 1}) 🧠</h4>
                      <div style={{ fontSize: `${fontSize}px` }}><ReactMarkdown>{explanation}</ReactMarkdown></div>
                    </div>
                  ))}
                  <button
                    onClick={() => fetchDetailedExplanation(topic)}
                    disabled={loadingDetailed[topic]}
                    className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300"
                  >
                    {loadingDetailed[topic] ? 'Loading more cool stuff...' : `Discover ${detailLevels[topic] ? 'Even More' : 'More'} Awesome Facts!`}
                  </button>
                  <CustomVideo 
                      topic={topic}
                      questions={topic}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}