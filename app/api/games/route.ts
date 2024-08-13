import type { NextApiRequest, NextApiResponse } from 'next';
import { Game, subjectTopics } from '@/components/subjects/types';

const generateGames = (): Game[] => {
  const games: Game[] = [];
  let id = 1;

  Object.entries(subjectTopics).forEach(([subject, topics]) => {
    topics.forEach(topic => {
      games.push({
        id: id.toString(),
        name: `${topic} Challenge`,
        description: `Test your knowledge of ${topic} in ${subject}!`,
        instructions: `Answer questions related to ${topic}.`,
        difficulty: 'Medium', // You can randomize this or set based on topic
        subject: subject
      });
      id++;
    });
  });

  return games;
};

const games = generateGames();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game[]>
) {
  const { subject } = req.query;
  
  if (subject && typeof subject === 'string') {
    const filteredGames = games.filter(game => game.subject.toLowerCase() === subject.toLowerCase());
    res.status(200).json(filteredGames);
  } else {
    res.status(200).json(games);
  }
}