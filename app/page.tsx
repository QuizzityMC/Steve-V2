import Chatbot from '../components/Chatbot';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Steve, the AI Chatbot</h1>
      <Chatbot />
    </main>
  );
}

