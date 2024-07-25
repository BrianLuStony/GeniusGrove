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

const subjectTopics: Record<string, string[]> = {
  'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Linear Algebra', 'Number Theory', 'Trigonometry', 'Differential Equations', 'Discrete Mathematics', 'Topology'],
  'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Relativity', 'Optics', 'Nuclear Physics', 'Astrophysics', 'Fluid Dynamics', 'Particle Physics'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry', 'Polymer Chemistry', 'Electrochemistry', 'Thermochemistry', 'Nuclear Chemistry', 'Environmental Chemistry'],
  'Biology': ['Genetics', 'Ecology', 'Microbiology', 'Anatomy', 'Physiology', 'Botany', 'Zoology', 'Molecular Biology', 'Evolutionary Biology', 'Marine Biology'],
  'Computer Science': ['Algorithms', 'Data Structures', 'Artificial Intelligence', 'Machine Learning', 'Computer Networks', 'Databases', 'Operating Systems', 'Cybersecurity', 'Computer Graphics', 'Software Engineering'],
  'English': ['Classical Literature', 'Modern Literature', 'Poetry', 'Drama', 'Novel', 'Short Story', 'Literary Criticism', 'Comparative Literature', 'World Literature', 'Children\'s Literature' , 'Vocabulary']
};


export default function SubjectPage({ subjectName, subjectId, session }: SubjectPageProps) {
  const [rank, setRank] = useState<number | null>(null);
  const topics = subjectTopics[subjectName] || [];


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
        <h1 className="font-semibold text-lg md:text-3xl dark:text-white">{subjectName}</h1>
      </div>
      <div className="w-full mb-4">
        <CustomUser
          subject={subjectName}
          rank={rank}
          updateRank={updateRank}
          userId={Number(session?.user.id)}
          topics={topics}
        />
      </div>
    </main>
  );
}