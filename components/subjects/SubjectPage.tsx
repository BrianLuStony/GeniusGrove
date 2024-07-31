'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { incrementSubjectVisits} from '@/db';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SubjectPageProps, ExplanationSection, subjectTopics } from './type';
import Cookies from 'js-cookie';


const TopicExplanation: React.FC<{ explanation: string }> = ({ explanation }) => {
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
        <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
          {section.content.map((paragraph, pIndex) => (
            <ReactMarkdown key={pIndex} className="mb-2">{paragraph}</ReactMarkdown>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function SubjectPage({ subjectName, subjectId}: SubjectPageProps) {
  const [topicExplanations, setTopicExplanations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
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
        prompt: `Provide a brief explanation of ${topic} in ${subjectName}. Format the response with Markdown headings and bullet points for better readability. Use inline styles to make it looks better` 
      });
      setTopicExplanations(prev => ({ ...prev, [topic]: response.data.response }));
    } catch (error) {
      console.error('Failed to fetch topic explanation', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <h1 className="font-semibold text-lg md:text-3xl dark:text-white mb-8">{subjectName}</h1>
      <Accordion type="single" collapsible className="w-full mt-8 dark:text-white">
        {topics.map((topic, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger onClick={() => fetchTopicExplanation(topic)}>{topic}</AccordionTrigger>
            <AccordionContent>
              {loading && topicExplanations[topic] === undefined ? (
                <p>Loading explanation...</p>
              ) : (
                <TopicExplanation explanation={topicExplanations[topic] || ''} />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}