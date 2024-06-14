import Chatbox from "@/components/chat/chat-box"
export default function ChatPage(){
    return(
        <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
            <h1 className="font-semibold text-lg md:text-2xl">Chat</h1>
        </div>
        <div className="w-full mb-4">
            <Chatbox/>
        </div>
        </main>
    )
}