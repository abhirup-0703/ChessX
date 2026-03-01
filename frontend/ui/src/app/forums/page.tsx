import ForumPageLayout from '@/features/forums/pages/ForumPageLayout';
import Header from '@/features/shared/components/Header';

export default function ForumsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex-1 overflow-hidden">
        <ForumPageLayout />
      </div>
    </div>
  );
}