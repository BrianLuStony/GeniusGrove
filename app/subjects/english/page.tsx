import SubjectPage from '@/components/subjects/SubjectPage';
import {auth} from "@/auth"
export default async function EnglishPage() {
    const session = await auth();
    return <SubjectPage subjectName="English" subjectId={1} session={session}/>;
  }