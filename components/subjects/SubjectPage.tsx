'use client';
import { useEffect, useState } from 'react';
import CustomUser from '@/components/questionnaire/custom-user';
import { initializeOrGetRanking } from '@/db';
import { Session } from 'next-auth';

interface SubjectPageProps {
  subjectName: string;
  subjectId: number;
  session: Session | null;
}

export default function SubjectPage({ subjectName, subjectId, session }: SubjectPageProps) {
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRank() {
      if (session && session.user && session.user.id) {
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
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">{subjectName}</h1>
      </div>
      <div className="w-full mb-4">
        <CustomUser
          subject={subjectName}
          rank={rank}
          updateRank={updateRank}
          userId={Number(session?.user.id)}
        />
      </div>
    </main>
  );
}