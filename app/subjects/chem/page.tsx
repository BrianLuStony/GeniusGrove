import SubjectPage from '@/components/subjects/SubjectPage';
import { auth } from '@/auth';
export default async function ChemPage() {
    const session = await auth();
    return <SubjectPage subjectName="Chemistry" subjectId={3} session={session}/>;
  }