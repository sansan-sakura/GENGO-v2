import { Link } from 'react-router-dom'
import { AiFillDelete } from 'react-icons/ai'
import { GiBookmarklet } from 'react-icons/gi'
import { MdOutlineEdit } from 'react-icons/md'
import { InputEditDeck } from './InputEditDeck'
import { Modal } from '../../../ui/generic/Modal'
import { DeckType } from '../../../types/flashcardTypes'
import { useChooseCategoryColor } from '../../category/category/useChooseCategoryColor'
import { useRecoilState } from 'recoil'
import { modalConfirmIdState, modalIDstate } from '../../../atoms/commonAtoms'
import { useDeleteDeck } from '../hooks/useDeleteDeck'
import { ModalConfirm } from '../../../ui/generic/ModalConfirm'
import { useEditDeck } from '../hooks/useEditDeck'

export const CardDeck = ({ card, index }: { card: DeckType; index?: number }) => {
  //toggle open modal
  const [modalId, setModalId] = useRecoilState(modalIDstate)
  //Delete deck
  const { deleteDeck, isDeleting, isError: isDeletingError } = useDeleteDeck()
  //Edit deck
  const { isEditing, editDeck, isError } = useEditDeck(true)
  //Toggle open Confirm modal to delete deck
  const [modalConfirmId, setModalConfirmId] = useRecoilState(modalConfirmIdState)

  //choose category color
  const cardCategory = card?.category?.category ?? null
  const categoryBgColor = useChooseCategoryColor(cardCategory)

  const handelDeleteDeck = () => {
    if (card?._id === undefined) return
    deleteDeck(card._id)
  }
  const handleCheck = () => {
    const id = card?._id
    if (id === undefined) return
    const newData = { isChecked: !card?.isChecked }
    editDeck({ id, newData })
  }
  return (
    <>
      {/* Tags on right side */}
      <div className='relative h-fit w-fit'>
        <div
          onClick={() => setModalId(`modalDeckEdit/${card?._id}`)}
          className='ease absolute -right-5 top-5 z-10 flex h-10 w-5 cursor-pointer items-center justify-center rounded-br-md rounded-tr-md bg-yellow-default text-white transition duration-100 hover:brightness-95'
        >
          <MdOutlineEdit />
        </div>
        <div
          onClick={() => setModalConfirmId(`modalConfirm/${card?._id}`)}
          className='ease absolute -right-5 bottom-[70px] z-10 flex h-10 w-5 cursor-pointer items-center justify-center rounded-br-md rounded-tr-md bg-red-dark text-white transition duration-100 hover:brightness-95'
        >
          <AiFillDelete />
        </div>
        <div
          onClick={handleCheck}
          className={`ease
        absolute -right-5 bottom-5 z-10 flex h-10 w-5 cursor-pointer items-center justify-center rounded-br-md rounded-tr-md ${
          card?.isChecked ? 'bg-blue-dark' : 'bg-blue-dark/70'
        } text-white transition duration-100 hover:brightness-95`}
        >
          <GiBookmarklet />
        </div>

        <Link
          to={`/deck/${card._id}`}
          className='group relative block  h-44 w-[280px] rounded-sm shadow-xl sm:w-[310px] xl:w-[360px]'
        >
          {card.category?.category && categoryBgColor?.color && (
            <div
              className={`absolute -top-5 right-3 w-fit rounded-t-sm text-white ${categoryBgColor?.color} px-2 pb-[3px] pt-1 text-xs transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1`}
            >
              {card.category.category}
            </div>
          )}
          <span
            className={`absolute inset-0 rounded-sm border-[0.5px] border-dashed border-black`}
          ></span>
          {/* Card  */}
          <div className='relative h-full transform rounded-sm border-[0.5px] border-black bg-amber-50 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1'>
            <div className='flex h-full flex-col justify-between p-2 transition-opacity sm:p-6 lg:p-4'>
              <h2 className='text-xl font-medium sm:text-2xl'>{card.title}</h2>

              <div className='flex justify-between'>
                <small>{card?.cards?.length} cards</small>
                <small>created at: {card.createdAt.toString().split('T')[0]}</small>
              </div>
            </div>
          </div>
        </Link>

        {/* Modals */}
        {modalConfirmId === `modalConfirm/${card?._id}` && (
          <ModalConfirm
            header='Delete Deck'
            id={`modalConfirm/${card?._id}`}
            onClick={handelDeleteDeck}
            isLoading={isDeleting}
            isError={isDeletingError}
          />
        )}

        {modalId === `modalDeckEdit/${card?._id}` && (
          <Modal id={`modalDeckEdit/${card?._id}`} header='Edit Deck'>
            <InputEditDeck
              deckId={card?._id}
              defaultCategory={card?.category?.category}
              defaultTitle={card?.title}
            />
          </Modal>
        )}
      </div>
    </>
  )
}
