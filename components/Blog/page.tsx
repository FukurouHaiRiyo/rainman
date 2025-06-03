import SectionTitle from '../Common/SectionTitle';
import SingleBlog from './SingleBlog';
import blogData from './blogData';

const Blog = () => {
  return (
    <section
      id='blog'
      className='bg-background text-foreground py-16 md:py-20 lg:py-28'
    >
      <div className='container'>
        <SectionTitle
          title='Articole din Expertiza Noastră'
          paragraph='Explorează cele mai noi articole despre securitate informațională, programare, logistică și hardware. Informație aplicabilă, direct din practică.'
          center
        />

        <div className='grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3'>
          {blogData.map((blog) => (
            <div key={blog.id} className='w-full'>
              <SingleBlog blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
