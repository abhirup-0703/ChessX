import TeamPageLayout from '@/features/teams/pages/TeamPageLayout';
import Header from '@/features/shared/components/Header';

export default function TeamsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-1 overflow-hidden">
        <TeamPageLayout />
      </div>
    </div>
  );
}