import SubjectPage from '@/components/subjects/SubjectPage';
import { auth } from '@/auth';
export default async function MathPage() {
    const session = await auth();
    return <SubjectPage subjectName="Mathematics" subjectId={2} session={session}/>;
  }