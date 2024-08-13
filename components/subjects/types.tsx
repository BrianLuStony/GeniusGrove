import { Session } from "next-auth";

export interface QuizPageProps {
    subjectName: string;
    subjectId: number;
    session: Session | null;
}

export interface SubjectPageProps {
    subjectName: string;
    subjectId: number;
}

export interface ExplanationSection {
    title: string;
    content: string[];
}

export const subjectTopics: Record<string, string[]> = {
    'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Linear Algebra', 'Number Theory', 'Trigonometry', 'Differential Equations', 'Discrete Mathematics', 'Topology'],
    'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Relativity', 'Optics', 'Nuclear Physics', 'Astrophysics', 'Fluid Dynamics', 'Particle Physics'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry', 'Polymer Chemistry', 'Electrochemistry', 'Thermochemistry', 'Nuclear Chemistry', 'Environmental Chemistry'],
    'Biology': ['Genetics', 'Ecology', 'Microbiology', 'Anatomy', 'Physiology', 'Botany', 'Zoology', 'Molecular Biology', 'Evolutionary Biology', 'Marine Biology'],
    'Computer Science': ['Algorithms', 'Data Structures', 'Artificial Intelligence', 'Machine Learning', 'Computer Networks', 'Databases', 'Operating Systems', 'Cybersecurity', 'Computer Graphics', 'Software Engineering'],
    'English': ['Classical Literature', 'Modern Literature', 'Poetry', 'Drama', 'Novel', 'Short Story', 'Literary Criticism', 'Comparative Literature', 'World Literature', 'Children\'s Literature' , 'Vocabulary']
};
  
export interface Game {
    id: string;
    name: string;
    description: string;
    instructions: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    subject: string;
  }
  
  export type Difficulty = 'Easy' | 'Medium' | 'Hard';