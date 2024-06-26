import { PiSpinnerGapBold } from 'react-icons/pi'

export const Spinner = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <PiSpinnerGapBold className='h-10 w-10 animate-spin text-blue-dark' />
    </div>
  )
}
