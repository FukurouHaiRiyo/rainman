import React from 'react';

const Wms = () => {
  return (
    <>
      <div className='bg-white max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center'>
          <div>
            <h1 className='block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight'>Incepeti calatoria cu <span className='text-blue-600'>Rainman</span></h1>
            <p className='mt-3 text-lg text-gray-800 dark:text-neutral-400'>Optimizati operatiunile din depozit cu solutii in cloud sau on premise.
            Administrati automat si complet toate activitatile din depozit pentru un numar nelimitat de entitati.</p>

            <div className='mt-7 grid gap-3 w-full sm:inline-flex'>
              <a className='py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none' href='/ContactUs'>
                Contactati-ne
                <svg className='shrink-0 size-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='m9 18 6-6-6-6'/></svg>
              </a>
            </div>
            
          </div>

          <div className='relative ms-4'>
            <img className='w-full rounded-md' src='image.png' alt='Hero Image' />
            <div className='absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0'></div>
          </div>
        </div>
      </div>

      <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
        <div className='aspect-w-16 aspect-h-7'>
          <img className='w-full object-cover rounded-xl' src='images.jpg' alt='features image'/>
        </div>

        <div className='mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12'>
          <div className='lg:col-span-1'>
            <h2 className='font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200'>
            Scalabilitate si flexibilitate
            la dimensiunea si complexitatea afacerii
            </h2>

            <p className='mt-2 md:mt-4 text-gray-500 dark:text-neutral-500'>
              Fiecare companie are nevoi, obiective si modele operationale diferite.

              Avem solutii WMS care acopera toate nevoile companiilor cu activitati de depozitare, pentru un numar nelimitat de 
              entitati.
            </p>
          </div>

          <div className='flex gap-5'>
            <svg className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M7 10v12'/><path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z'/></svg>
            <div className='row'>
              <h3 className='text-lg font-semibold text-gray-600 dark:text-gray-600'>
                Eficientizati operatiunile din depozit
              </h3>

              <p className='mt-1 text-gray-600 dark:text-gray-600'>
                De la ambalare la gestionarea stocurilor si expediere
              </p>
            </div>
          </div>

          <div className='flex gap-x-5'>
            <svg className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>
            <div className='grow'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-900'>
                Imbunatatiti utilizarea resurselor din depozit
              </h3>

              <p></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wms;