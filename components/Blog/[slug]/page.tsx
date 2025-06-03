// app/blog/[slug]/page.tsx
import blogData from '@/components/Blog/blogData';
import BlogDetailsPage from '@/app/blog-details/page';

interface Params {
  params: {
    slug: string;
  };
}

export default function BlogSlugPage({ params }: Params) {
  const blog = blogData.find((b) => b.slug === params.slug);

  if (!blog) return <div>404 - Articolul nu a fost găsit</div>;

  return <BlogDetailsPage blog={blog} />;
}
