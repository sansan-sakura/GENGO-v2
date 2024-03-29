import { useState, useEffect } from 'react'
// import { Label } from '../Flashcard/Label'

import { CardType } from '../../../types/flashcardTypes'
import { Spinner } from '../../../ui/generic/Spinner'
import { labels, labelsColors } from '../../../statics/colors'
import { Toaster } from '../../../ui/shadcn/toaster'
import { Button } from '../../../ui/shadcn/Button'
import { Progress } from '../../../ui/shadcn/Progress'
import { PopoverCustom } from '../../../ui/generic/Popover/PopoverCustom'
import { useRecoilState } from 'recoil'
import { modalIDstate } from '../../../atoms/commonAtoms'
import { Modal } from '../../../ui/generic/Modal'
import { InputCreateFlashcard } from '../../flashcard'
import { InputUpdateFlashcard } from '../../flashcard/components/InputUpdateFlashcard'

const status = ['easy', 'okay', 'hard', 'very hard']
const deckId = '1'
export const Deck = ({ cards }: { cards?: Array<CardType> }) => {
  const [progress, setProgress] = useState(13)
  const [isChecked, setIsChecked] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState<CardType>()
  const [isFinished, setIsFinished] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalId, setModalId] = useRecoilState(modalIDstate)

  //   useEffect(() => {
  //     if (cards.length === 0 || cards === undefined) return
  //     setCurrentCard(cards[currentIndex])
  //   }, [cards, setCurrentCard, currentIndex])

  //   if (currentCard === undefined) return <Spinner />

  //   const { answer, question, status, _id } = currentCard

  //   const handleClick = () => {
  //     if (cards.length === currentIndex + 1) setIsFinished(true)
  //     if (cards.length > currentIndex + 1) setCurrentIndex((prev) => prev + 1)
  //     setIsChecked(false)
  //   }

  //   const handleDelete = () => {
  //     const confirmDelete = confirm('Are you sure to delete this flashcard?')
  //     if (!confirmDelete) return null
  //     deleteFlashcard(_id)
  //   }

  const handlePlayAgain = () => {
    setCurrentIndex(0)
    setIsFinished(false)
  }

  if (isFinished)
    return (
      <div className='flex h-full flex-col items-center justify-center gap-10 text-center'>
        <p className='text-lg font-semibold text-blue-dark sm:text-2xl'>
          This deck has no more cards to review
        </p>

        <Button variant='blue' size='lg' onClick={handlePlayAgain}>
          Again
        </Button>
      </div>
    )

  return (
    <>
      <Toaster />
      <div className='relative flex  h-full flex-col items-center'>
        <Progress value={progress} />
        <div className='flex h-full w-fit flex-col items-center justify-center gap-14'>
          {!isChecked ? (
            <>
              <h3 className='text-lg  sm:text-2xl'>What is human in Swedish</h3>
              <Button
                onClick={() => setIsChecked(true)}
                variant={'blue'}
                className='mx-auto uppercase text-white'
              >
                Check
              </Button>
            </>
          ) : (
            <>
              <h3 className=' text-lg sm:text-2xl'>Man</h3>
              <div className='text-end'>
                <div className='flex gap-2'>
                  {status.map((item) => (
                    <Button
                      onClick={() => setIsChecked(true)}
                      variant={'blue'}
                      className='mx-auto uppercase  text-white'
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <p className='mt-1 text-xs'>last status: easy</p>
              </div>
            </>
          )}
        </div>
        <PopoverCustom>
          <div className='grid items-center gap-2 font-semibold text-blue-dark'>
            <button
              className='transition-none hover:brightness-150'
              onClick={() => setModalId('modal/addFlashcard')}
            >
              Add Flashcard
            </button>
            <button
              onClick={() => setModalId('modal/updateFlashcard')}
              className='transition-none hover:brightness-150'
            >
              Edit Flashcard
            </button>
          </div>
        </PopoverCustom>
      </div>

      {modalId === 'modal/addFlashcard' && (
        <Modal header='Add New Flashcard' id='modal/addFlashcard'>
          <InputCreateFlashcard deckId={deckId} />
        </Modal>
      )}
      {modalId === 'modal/updateFlashcard' && (
        <Modal header='Add New Flashcard' id='modal/updateFlashcard'>
          <InputUpdateFlashcard cards={cards ?? []} />
        </Modal>
      )}
    </>
  )
}
