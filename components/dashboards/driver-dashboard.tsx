export function DriverDashboard() {
  return (
    <div className='grid gap-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium'>Livrările de astăzi</h3>
          <p className='text-3xl font-bold mt-2'>5</p>
        </div>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium'>Uși disponibile</h3>
          <p className='text-3xl font-bold mt-2'>3</p>
        </div>
      </div>
      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium mb-4'>Program de livrare</h3>
        <div className='space-y-4'>
          <div className='p-3 border rounded-lg'>
            <div className='flex justify-between items-center'>
              <span className='font-medium'>Order #12345</span>
              <span className='px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>9:00 AM</span>
            </div>
            <p className='text-sm text-muted-foreground mt-1'>123 Main St, Anytown, USA</p>
          </div>
          <div className='p-3 border rounded-lg'>
            <div className='flex justify-between items-center'>
              <span className='font-medium'>Order #12346</span>
              <span className='px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>11:30 AM</span>
            </div>
            <p className='text-sm text-muted-foreground mt-1'>456 Oak Ave, Somewhere, USA</p>
          </div>
          <div className='p-3 border rounded-lg'>
            <div className='flex justify-between items-center'>
              <span className='font-medium'>Order #12347</span>
              <span className='px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>2:00 PM</span>
            </div>
            <p className='text-sm text-muted-foreground mt-1'>789 Pine St, Nowhere, USA</p>
          </div>
        </div>
      </div>
    </div>
  )
}
