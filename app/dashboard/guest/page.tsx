import React from 'react';

const GuestDashboard = () => {
  return (
    <div className='grid gap-6'>
      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium mb-4'>Bine ați venit la Sistemul de management al depozitelor</h3>

        <p className='text-muted-foreground'>
          În prezent, contul dvs. este setat pentru acces de invitat. Vă rugăm să contactați un administrator pentru a solicita 
          suplimentar permisiuni.
        </p>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium mb-4'>Prezentare generală a sistemului</h3>
        <p className='text-muted-foreground'>
          Acest sistem oferă capabilități complete de gestionare a depozitelor, inclusiv urmărirea stocurilor, comenzile
          procesare, managementul șoferului și multe altele.
        </p>
      </div>
    </div>
  )
}

export default GuestDashboard