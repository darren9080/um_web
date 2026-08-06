import { SectionHeader } from '@/app/ui/admin/section-header';
import ArticleEditorForm from '@/app/ui/admin/article-editor-form';

export default function NewArticlePage() {
  return (
    <>
      <SectionHeader title="새 기사" description="새 기사를 작성합니다." />
      <ArticleEditorForm />
    </>
  );
}
