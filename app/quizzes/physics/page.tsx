import QuizPage from '@/components/subjects/QuizPage';
import { auth } from '@/auth';
export default async function MathPage() {
    const session = await auth();
    return <QuizPage subjectName="Physics" subjectId={5} session={session}/>;
  }