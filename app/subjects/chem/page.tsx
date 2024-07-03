import CustomUser  from '@/components/questionnaire/custom-user'

export default function ChemPage() {
    
    return (
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
          <h1 className="font-semibold text-lg md:text-2xl">Chemistry</h1>
        </div>
        <div className="w-full mb-4">
          <CustomUser subject="chemistry"/>
        </div>
      </main>
    );
  }