'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { incrementSubjectVisits } from '@/db';
import CustomVideo from '../questionnaire/custom-video';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SubjectPageProps, ExplanationSection, subjectTopics } from './type';
import Cookies from 'js-cookie';

const TopicExplanation: React.FC<{ explanation: string; fontSize: number }> = ({ explanation, fontSize }) => {
  const parseExplanation = (text: string): ExplanationSection[] => {
    const lines = text.split('\n');
    const sections: ExplanationSection[] = [];
    let currentSection: ExplanationSection | null = null;

    lines.forEach(line => {
      if (line.startsWith('##')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.replace('##', '').trim(), content: [] };
      } else if (line.trim() !== '') {
        if (currentSection) {
          currentSection.content.push(line.trim());
        } else {
          currentSection = { title: 'Overview', content: [line.trim()] };
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
        <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg" style={{ fontSize: `${fontSize}px` }}>
          <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
          {section.content.map((paragraph, pIndex) => (
            <ReactMarkdown key={pIndex} className="mb-2">{paragraph}</ReactMarkdown>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function SubjectPage({ subjectName, subjectId }: SubjectPageProps) {
  const [topicExplanations, setTopicExplanations] = useState<Record<string, string>>({});
  const [detailedExplanations, setDetailedExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingDetailed, setLoadingDetailed] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSize] = useState(16); // Default font size
  const topics = subjectTopics[subjectName] || [];

  useEffect(() => {
    const updateVisits = async () => {
      const visitedSubjects = Cookies.get('visitedSubjects');
      const visitedSubjectsArray = visitedSubjects ? JSON.parse(visitedSubjects) : [];

      if (!visitedSubjectsArray.includes(subjectId)) {
        try {
          await incrementSubjectVisits(subjectId);
          visitedSubjectsArray.push(subjectId);
          Cookies.set('visitedSubjects', JSON.stringify(visitedSubjectsArray), { expires: 1 }); // Cookie expires in 1 day
        } catch (error) {
          console.error('Failed to update subject visits', error);
        }
      }
    };

    updateVisits();
  }, [subjectId]);

  const fetchTopicExplanation = async (topic: string) => {
    if (topicExplanations[topic]) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/api/chat', { 
        prompt: `Provide a brief explanation of ${topic} in ${subjectName}. Format the response with Markdown headings and bullet points for better readability. Use inline styles to make it look better. Provide links to the related sources and make it more obvious it’s a link` 
      });
      setTopicExplanations(prev => ({ ...prev, [topic]: response.data.response }));
    } catch (error) {
      console.error('Failed to fetch topic explanation', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedExplanation = async (topic: string) => {
    setLoadingDetailed(prev => ({ ...prev, [topic]: true }));

    try {
      const response = await axios.post('/api/chat', { 
        prompt: `Provide a more in-depth explanation of ${topic} in ${subjectName}. Format the response with Markdown headings and bullet points for better readability. Include additional insights and more detailed information.` 
      });
      setDetailedExplanations(prev => ({
        ...prev,
        [topic]: response.data.response
      }));
    } catch (error) {
      console.error('Failed to fetch detailed explanation', error);
    } finally {
      setLoadingDetailed(prev => ({ ...prev, [topic]: false }));
    }
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <h1 className="font-semibold text-lg md:text-3xl dark:text-white mb-8">{subjectName}</h1>
      <div className="flex justify-between mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
          onClick={() => setFontSize(prev => Math.max(prev - 2, 10))}
        >
          Decrease Font
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setFontSize(prev => Math.min(prev + 2, 30))}
        >
          Increase Font
        </button>
      </div>
      <Accordion type="single" collapsible className="w-full mt-8 dark:text-white">
        {topics.map((topic, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger onClick={() => fetchTopicExplanation(topic)}>{topic}</AccordionTrigger>
            <AccordionContent>
              {loading && topicExplanations[topic] === undefined ? (
                <p>Loading explanation...</p>
              ) : (
                <div>
                  <TopicExplanation 
                    explanation={topicExplanations[topic] || ''} 
                    fontSize={fontSize}
                  />
                  {detailedExplanations[topic] && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">In-Depth Explanation</h4>
                      <div style={{ fontSize: `${fontSize}px` }}><ReactMarkdown>{detailedExplanations[topic]}</ReactMarkdown></div>
                    </div>
                  )}
                  <button
                    onClick={() => fetchDetailedExplanation(topic)}
                    disabled={loadingDetailed[topic] || !!detailedExplanations[topic]}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-300"
                  >
                    {loadingDetailed[topic] ? 'Loading more...' : detailedExplanations[topic] ? 'More details available' : 'Get More In-Depth Explanation'}
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
