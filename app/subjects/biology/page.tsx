import SubjectPage from '@/components/subjects/SubjectPage';
import { auth } from '@/auth';
export default async function BioPage() {
    const session = await auth()
    console.log(session?.user.id);
    
    return <SubjectPage subjectName="Biology" subjectId={4} session={session} />;
  }