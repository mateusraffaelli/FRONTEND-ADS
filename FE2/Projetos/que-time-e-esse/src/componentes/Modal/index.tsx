import { type ReactNode } from 'react'
import { FaTimes } from 'react-icons/fa'

interface ModalProps {
  titulo: string
  onFechar: () => void
  children: ReactNode
}

const Modal = ({ titulo, onFechar, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-label={titulo}
        className="relative max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-lg bg-stone-900 p-6"
        onClick={(evento) => evento.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onFechar}
          className="absolute right-4 top-4 text-stone-300 hover:text-white"
        >
          <FaTimes />
        </button>
        <h2 className="mb-4 text-center text-xl font-bold">{titulo}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal
