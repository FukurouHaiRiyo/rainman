import { Blog } from '@/types/blog';

const blogData: Blog[] = [
  {
    id: 1,
    slug: 'cum-te-ajuta-iso-27001-sa-securizezi-compania',
    title: 'Cum te ajută ISO 27001 să-ți securizezi compania',
    paragraph:
      'Află cum implementarea unui sistem de management al securității informației (ISMS) conform ISO 27001 îți protejează afacerea de riscurile cibernetice.',
    image: '/images/blog/blog-01.jpg',
    author: {
      name: 'Andrei-Stefan Panait',
      image: '/images/blog/author-01.png',
      designation: 'Auditor Intern ISO 27001',
    },
    tags: ['audit', 'securitate'],
    publishDate: '2025',
  },
  {
    id: 2,
    slug: 'top-5-greseli-in-gestiunea-stocurilor',
    title: 'Top 5 greșeli în gestiunea stocurilor și cum le eviți',
    paragraph:
      'O bună organizare a depozitului reduce pierderile și crește eficiența. Vezi cele mai frecvente greșeli și soluții practice.',
    image: '/images/blog/blog-02.jpg',
    author: {
      name: 'Andrei-Stefan Panait',
      image: '/images/blog/author-02.png',
      designation: 'Consultant logistică',
    },
    tags: ['logistică', 'depozit'],
    publishDate: '2025',
  },
  {
    id: 3,
    slug: 'cele-mai-bune-practici-pentru-aplicatii-web',
    title: 'Cele mai bune practici pentru dezvoltarea aplicațiilor web',
    paragraph:
      'Din experiență: cum organizezi un proiect modern de programare pentru scalabilitate, performanță și securitate.',
    image: '/images/blog/blog-03.jpg',
    author: {
      name: 'Andrei-Stefan Panait',
      image: '/images/blog/author-03.png',
      designation: 'Software Engineer',
    },
    tags: ['programare', 'software'],
    publishDate: '2025',
  },
  {
    id: 4,
    slug: 'ghid-complet-asamblare-pc',
    title: 'Ghid complet pentru asamblarea unui PC performant',
    paragraph:
      'Învață cum să alegi și să montezi componentele potrivite pentru un sistem echilibrat, fie pentru birou, fie pentru gaming.',
    image: '/images/blog/blog-04.jpg',
    author: {
      name: 'Andrei-Stefan Panait',
      image: '/images/blog/author-04.png',
      designation: 'Tehnician hardware',
    },
    tags: ['hardware', 'pc'],
    publishDate: '2025',
  },
];

export default blogData;
