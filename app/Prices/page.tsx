'use client';
import { useState } from 'react';
import SectionTitle from '@/components/Common/SectionTitle';
import OfferList from './OfferList';
import PricingBox from './PricingBox';

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section
      id='pricing'
      className='relative z-10 py-16 md:py-20 lg:py-28 bg-background text-foreground'
    >
      <div className='container'>
        <SectionTitle
          title='Consultanță pentru orice buget'
          paragraph='Alege pachetul potrivit pentru afacerea ta – de la suport tehnic de bază la soluții complete pentru IT, securitate și logistică.'
          center
          width='665px'
        />

        <div className='w-full'>
          <div className='mb-8 flex justify-center md:mb-12 lg:mb-16'>
            <span
              onClick={() => setIsMonthly(true)}
              className={`${
                isMonthly
                  ? 'pointer-events-none text-primary'
                  : 'text-dark dark:text-white'
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              Lunar
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className='flex cursor-pointer items-center'
            >
              <div className='relative'>
                <div className='h-5 w-14 rounded-full bg-[#1D2144] shadow-inner'></div>
                <div
                  className={`${
                    isMonthly ? '' : 'translate-x-full'
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className='active h-4 w-4 rounded-full bg-white'></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${
                isMonthly
                  ? 'text-dark dark:text-white'
                  : 'pointer-events-none text-primary'
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              Anual
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3'>
          <PricingBox
            packageName='Lite'
            price={isMonthly ? '99' : '999'}
            duration={isMonthly ? 'lună' : 'an'}
            subtitle='Pachet ideal pentru afaceri mici care au nevoie de suport IT ocazional.'
          >
            <OfferList text='Consultanță hardware și PC build-uri' status='active' />
            <OfferList text='Mentorat programare web (React/TS)' status='active' />
            <OfferList text='Asistență remote pentru probleme IT' status='active' />
            <OfferList text='1 audit ISO 27001 intern/an' status='inactive' />
            <OfferList text='Optimizare fluxuri depozit' status='inactive' />
            <OfferList text='Documentație tehnică personalizată' status='inactive' />
          </PricingBox>

          <PricingBox
            packageName='Basic'
            price={isMonthly ? '299' : '2999'}
            duration={isMonthly ? 'lună' : 'an'}
            subtitle='Pentru companii ce au nevoie de expertiză tehnică continuă și audit.'
          >
            <OfferList text='Consultanță hardware și rețea' status='active' />
            <OfferList text='Audit intern ISO 27001 (1/an)' status='active' />
            <OfferList text='Suport dezvoltare aplicații (React, Next.js, C#)' status='active' />
            <OfferList text='Optimizare procese depozit și trasabilitate' status='active' />
            <OfferList text='Training angajați – IT și securitate' status='active' />
            <OfferList text='Backup și criptare fișiere' status='inactive' />
          </PricingBox>

          <PricingBox
            packageName='Plus'
            price={isMonthly ? '499' : '4499'}
            duration={isMonthly ? 'lună' : 'an'}
            subtitle='Soluția completă de consultanță pentru companii ce doresc excelență în IT și logistică.'
          >
            <OfferList text='Soluții avansate IT și automatizări' status='active' />
            <OfferList text='Audit ISO 27001 complet & documentație' status='active' />
            <OfferList text='Securitate IT – politici, training, testare' status='active' />
            <OfferList text='Aplicații personalizate gestionare depozite' status='active' />
            <OfferList text='Mentenanță hardware, licențiere & upgrade-uri' status='active' />
            <OfferList text='Support tehnic prioritar 24/7' status='active' />
          </PricingBox>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
