// components/Blog/BlogDetailsPage.tsx
import { Blog } from '@/types/blog';
import Image from 'next/image';
import SharedPost from '@/components/Blog/SharedPost';
import TagButton from '@/components/Blog/TagButton';

const BlogDetailsPage = ({ blog }: { blog: Blog }) => {
  return (
    <section className='pt-[150px] pb-[120px]'>
      <div className='container'>
        <div className='-mx-4 flex flex-wrap justify-center'>
          <div className='w-full px-4 lg:w-8/12'>
            <div>
              <h2 className='mb-8 text-3xl font-bold dark:text-white'>{blog.title}</h2>
              <div className='mb-4 flex items-center text-sm text-body-color'>
                <Image
                  src={blog.author.image}
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className='rounded-full mr-3'
                />
                <span>{blog.author.name} • {blog.publishDate}</span>
              </div>
              <div className='mb-10 w-full overflow-hidden rounded-sm'>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={800}
                  height={400}
                  className='rounded-lg'
                />
              </div>
              <p className='text-lg text-body-color leading-relaxed mb-8'>{blog.paragraph}</p>
              <div className='mb-8 flex gap-2'>
                {blog.tags.map((tag, i) => (
                  <TagButton key={i} text={tag} />
                ))}
              </div>
              <SharedPost />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsPage;
