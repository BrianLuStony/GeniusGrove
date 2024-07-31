import QuizPage from '@/components/subjects/QuizPage';
import { auth } from '@/auth';
export default async function BioPage() {
    const session = await auth()
    return <QuizPage subjectName="Biology" subjectId={4} session={session} />;
  }