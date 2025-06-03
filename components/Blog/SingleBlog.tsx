// components/Blog/SingleBlog.tsx
import Link from 'next/link';
import { Blog } from '@/types/blog';
import Image from 'next/image';

const SingleBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className='rounded-lg shadow-lg overflow-hidden bg-white dark:bg-dark p-4'>
      <Link href={`/blog/${blog.slug}`}>
        <div className='relative w-full h-56 mb-4'>
          <Image src={blog.image} alt={blog.title} fill className='object-cover rounded-md' />
        </div>
        <h3 className='text-xl font-bold mb-2 text-black dark:text-white'>{blog.title}</h3>
        <p className='text-body-color'>{blog.paragraph}</p>
      </Link>
    </div>
  );
};

export default SingleBlog;
