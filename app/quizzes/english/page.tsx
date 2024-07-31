import QuizPage from '@/components/subjects/QuizPage';
import {auth} from "@/auth"
export default async function EnglishPage() {
    const session = await auth();
    return <QuizPage subjectName="English" subjectId={1} session={session}/>;
  }