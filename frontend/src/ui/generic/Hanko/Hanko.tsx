export const Hanko = ({
  size = 'md',
  src = '/gengo_logo.webp',
}: {
  size?: 'md' | 'sm' | 'xs'
  src?: string
}) => {
  return (
    <div className='w-fit'>
      <img
        src={src}
        className={`${
          size === 'sm' ? 'w-6 sm:w-7' : size === 'xs' ? 'w-4' : 'w-10 sm:w-14'
        }`}
      />
    </div>
  )
}
