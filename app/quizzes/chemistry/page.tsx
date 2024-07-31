import QuizPage from '@/components/subjects/QuizPage';
import { auth } from '@/auth';
export default async function ChemPage() {
    const session = await auth();
    return <QuizPage subjectName="Chemistry" subjectId={3} session={session}/>;
  }