'use client';
import { useEffect, useState } from 'react';
import CustomUser from '@/components/questionnaire/custom-user';
import { initializeOrGetRanking } from '@/db';
import { QuizPageProps ,subjectTopics } from './type';


export default function QuizPage({ subjectName, subjectId, session }: QuizPageProps) {
  const [rank, setRank] = useState<number | null>(null);
  const topics = subjectTopics[subjectName] || [];

  useEffect(() => {
    async function fetchRank() {
      if (session?.user?.id) {
        try {
          const ranking = await initializeOrGetRanking(Number(session.user.id), subjectId);
          setRank(ranking.rank);
        } catch (error) {
          console.error("Error fetching rank:", error);
        }
      }
    }
    fetchRank();
  }, [session, subjectId]);

  const updateRank = (newRank: number | null) => {
    setRank(newRank);
  };


  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <h1 className="font-semibold text-lg md:text-3xl dark:text-white mb-8">{subjectName}</h1>
      <CustomUser
        subject={subjectName}
        rank={rank}
        updateRank={updateRank}
        userId={Number(session?.user.id)}
        topics={topics}
      />
    </main>
  );
}