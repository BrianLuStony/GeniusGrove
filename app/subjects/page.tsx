import React from "react";
import CustomLink from "@/components/custom-link";

const SubPage = () => {
    return (
    <div className="p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Get started by selecting a subject:</h3>
        <ul className="grid grid-cols-2 gap-4">
          {['Biology', 'Mathematics', 'English', 'Chemistry'].map((subject) => (
            <li key={subject}>
              <CustomLink 
                href={`/subjects/${subject.toLowerCase()}`} 
                className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center text-lg font-medium text-cyan-600 hover:text-cyan-700"
              >
                {subject}
              </CustomLink>
            </li>
          ))}
        </ul>
      </div>
    )
}

export default SubPage;