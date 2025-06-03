// components/Blog/BlogDetailsPage.tsx

import { Blog } from "@/types/blog";

interface BlogDetailsPageProps {
  blog: Blog;
}

const BlogDetailsPage = ({ blog }: BlogDetailsPageProps) => {
  return (
    <section className="pt-[150px] pb-[120px]">
      <div className="container">
        <h2 className="text-3xl font-bold dark:text-white">{blog.title}</h2>
        <p className="text-body-color mt-4 mb-6">{blog.paragraph}</p>
        <p className="text-sm text-muted-foreground mb-2">By {blog.author.name} - {blog.publishDate}</p>
        <img src={blog.image} alt={blog.title} className="rounded-md mb-6" />
        {/* Adaugă mai mult conținut aici, dacă vrei */}
      </div>
    </section>
  );
};

export default BlogDetailsPage;
