// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import blogData from '@/components/Blog/blogData';
import BlogDetailsPage from '@/app/blog-details/[slug]/page';

export default function BlogSlugPage({ params }: { params: { slug: string } }) {
  const blog = blogData.find((b) => b.slug === params.slug);

  if (!blog) return notFound();

  return <BlogDetailsPage blog={blog} />;
}
