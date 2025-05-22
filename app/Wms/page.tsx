import Navbar from '@/components/Navbar';
import React from 'react';

const Wms = () => {
  return (
    // <>
    //   <div className='bg-white max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8'>
    //     <div className='grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center'>
    //       <div>
    //         <h1 className='block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight'>Incepeti calatoria cu <span className='text-blue-600'>Rainman</span></h1>
    //         <p className='mt-3 text-lg text-neutral-800 dark:text-gray-900'>Optimizati operatiunile din depozit cu solutii in cloud sau on premise.
    //           Administrati automat si complet toate activitatile din depozit pentru un numar nelimitat de entitati.</p>

    //         <div className='mt-7 grid gap-3 w-full sm:inline-flex'>
    //           <a className='py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none' href='/Contact'>
    //             Contactati-ne
    //             <svg className='shrink-0 size-4' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='m9 18 6-6-6-6'/></svg>
    //           </a>
    //         </div>
            
    //       </div>

    //       <div className='relative ms-4'>
    //         <img className='w-full rounded-md' src='image.png' alt='Hero Image' />
    //         <div className='absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0'></div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
    //     <div className='aspect-w-16 aspect-h-7'>
    //       <img className='w-full object-cover rounded-xl' src='images.jpg' alt='features image'/>
    //     </div>

    //     <div className='mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12'>
    //       <div className='lg:col-span-1'>
    //         <h2 className='font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-300'>
    //           Scalabilitate si flexibilitate
    //           la dimensiunea si complexitatea afacerii
    //         </h2>

    //         <p className='mt-2 md:mt-4 text-gray-500 dark:text-neutral-500'>
    //           Fiecare companie are nevoi, obiective si modele operationale diferite.

    //           Avem solutii WMS care acopera toate nevoile companiilor cu activitati de depozitare, pentru un numar nelimitat de 
    //           entitati.
    //         </p>
    //       </div>

    //       <div className='flex gap-5'>
    //         <svg className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M7 10v12'/><path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z'/></svg>
    //         <div className='row'>
    //           <h3 className='text-lg font-semibold text-gray-600 dark:text-gray-600'>
    //             WMS - Funcționalități standard
    //           </h3>

    //           <p className='mt-1 text-gray-600 dark:text-neutral-400'>
    //             Gestionarea codurilor de bare multiple și a procesului de ambalare. Gestionarea containerelor, gestionarea 
    //             imprimantelor de coduri de bare, gestionarea locației de depozitare, gestionarea resurselor, recepția mărfurilor 
    //             ad-hoc sau cu notă de recepție (NIR avansat), mutare marfă în depozit pe baza regulilor de alocare a stocurilor și 
    //             a capacității, Preluare comenzi si colectare marfă și pe destinatar, mișcări interne, reambalare și dezambalare, 
    //             gestionarea retururilor, încărcare marfă (vrac sau containere), inventariere anuală sau periodică.
    //           </p>
    //         </div>
    //       </div>

    //       <div className='flex gap-x-5'>
    //         <svg className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>
    //         <div className='grow'>
    //           <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-900'>
    //             WMS - Functionalitati avansate
    //           </h3>

    //           <p className='mt-1 text-gray-600 dark:text-neutral-400'>
    //             Alte functionalitati in receptia si depozitarea marfurilor sunt activate, picking si sortare grupate sunt, 
    //             de asemenea, activate, reaprovizionarea stocurilor la locatiile de ridicare pe baza algoritmilor incorporati, 
    //             reguli de alocare a stocurilor pe articol si profil de client, fluxuri de lucru complet ghidate pentru receptie, 
    //             putaway, picking, alocare avansata a resurselor. Integrare cu Pick to Light, Pick to Cart, transportoare, sortatoare, 
    //             AS/RS. Gestionarea mai multor depozite si/sau sit-uri. Gestionarea schimburilor, alocarea automata a sarcinilor, 
    //             reprogramarea si gestionarea alertelor.
    //           </p>
    //         </div>
    //       </div>

    //       <div className='flex gap-x-5'>
    //         <svg className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>
    //         <div className='grow'>
    //           <h3 className='text-lg font-semibold text-gray-800 dark:text-neutral-600'>
    //             Gestionarea stocurilor
    //           </h3>

    //           <p className='mt-1 text-gray-600 dark:text-neutral-400'>
    //             Programarea inventarului anual, preluare sarcini pentru fiecare locatie de depozitare/articol/palet/etc., 
    //             alocarea resurselor pe sarcina/task, actualizarea in timp real a stocului din ERP, inventariere periodica bazata pe 
    //             propunerile sistemului.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
      <Navbar />
      <div className='max-w-screen-xl mx-auto py-8 px-4 lg:py-16 lg:px-6'>
        <div className='text-center mb-10'>
          <h2 className='text-4xl tracking-tight font-bold text-primary-800'>
            Servicii
          </h2>
        </div>

        <div className='flex flex-col md:flex-row'>
          <div className='mr-0 md:mr-8 mb-6 md:mb-0'>
            <img className='w-1/2 md:w-full mx-auto' src='https://placeholder.pics/svg/400' alt='can_help_banner' />
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <a href='/Contact' className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focu-visible:outline-2 focus-visible:outline-indigo-600'>
                Contactati-ne
              </a>
            </div>
          </div>



          <div className='flex-1 flex flex-col sm:flex-row flex-wrap -mb-4 -mx-2'>
            <div className='w-full sm:w-1/2 mb-4 px-2'>
              <div className='h-full py-4 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl'>
                <h3 className='text-2xl font-bold text-md mb-6'></h3>
                <p className='text-sm'>Optimizati operatiunile din depozit cu solutii in cloud sau on premise. Administrati automat si complet toate activitatile din depozit pentru un numar nelimitat de entitati.</p>
              </div>
            </div>

            <div className='w-full sm:w-1/2 mb-4 px-2'>
              <div className='h-full py-4 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl'>
                <h3 className='text-2xl font-bold text-md mb-6'>Scalabilitate si flexibilitate la dimensiunea si complexitatea afacerii</h3>
                <p className='text-sm'> 
                  Fiecare companie are nevoi, obiective si modele operationale diferite. Avem solutii WMS care acopera toate nevoile companiilor cu activitati de depozitare, pentru un numar nelimitat de entitati.
                </p>
              </div>
            </div>

            <div className='w-full sm:w-1/2 mb-4 px-2'>
              <div className='h-full py-4 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl'>
                <h3 className='text-2xl font-bold text-md mb-6'>WMS - Funcționalități standard</h3>
                <p className='text-sm'> 
                Gestionarea codurilor de bare multiple și a procesului de ambalare. Gestionarea containerelor, gestionarea imprimantelor de coduri de bare, gestionarea locației de depozitare, gestionarea resurselor, recepția mărfurilor ad-hoc sau cu notă de recepție (NIR avansat), mutare marfă în depozit pe baza regulilor de alocare a stocurilor și a capacității, Preluare comenzi si colectare marfă și pe destinatar, mișcări interne, reambalare și dezambalare, gestionarea retururilor, încărcare marfă (vrac sau containere), inventariere anuală sau periodică.
                </p>
              </div>
            </div>

            <div className='w-full sm:w-1/2 mb-4 px-2'>
              <div className='h-full py-4 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl'>
                <h3 className='text-2xl font-bold text-md mb-6'>WMS - Functionalitati avansate</h3>
                <p className='text-sm'> 
                  Alte functionalitati in receptia si depozitarea marfurilor sunt activate, picking si sortare grupate sunt, de asemenea, activate, reaprovizionarea stocurilor la locatiile de ridicare pe baza algoritmilor incorporati, reguli de alocare a stocurilor pe articol si profil de client, fluxuri de lucru complet ghidate pentru receptie, putaway, picking, alocare avansata a resurselor. Integrare cu Pick to Light, Pick to Cart, transportoare, sortatoare, AS/RS. Gestionarea mai multor depozite si/sau sit-uri. Gestionarea schimburilor, alocarea automata a sarcinilor, reprogramarea si gestionarea alertelor.
                </p>
              </div>
            </div>

            <div className='w-full sm:w-1/2 mb-4 px-2'>
              <div className='h-full py-4 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl'>
                <h3 className='text-2xl font-bold text-md mb-6'>Gestionarea stocurilor</h3>
                <p className='text-sm'> 
                  Programarea inventarului anual, preluare sarcini pentru fiecare locatie de depozitare/articol/palet/etc., alocarea resurselor pe sarcina/task, actualizarea in timp real a stocului din ERP, inventariere periodica bazata pe propunerile sistemului.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wms;