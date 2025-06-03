import { Blog } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { slug, title, image, paragraph, author, tags, publishDate } = blog;

  return (
    <div className='group shadow-one hover:shadow-two dark:bg-card bg-white rounded-xs overflow-hidden'>
      <Link href={`/blog/${slug}`} className='block relative aspect-[16/9]'>
        <Image src={image} alt={title} fill className='object-cover' />
      </Link>
      <div className='p-6'>
        <h3>
          <Link href={`/blog/${slug}`} className='text-xl font-bold hover:text-primary'>
            {title}
          </Link>
        </h3>
        <p className='mt-4 text-muted-foreground'>{paragraph}</p>
        <div className='mt-4 text-sm text-body-color'>By {author.name} · {publishDate}</div>
      </div>
    </div>
  );
};

export default SingleBlog;
