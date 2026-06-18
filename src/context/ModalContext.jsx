import { createContext, useContext, useState, useCallback } from 'react'

const ModalContext = createContext(null)

export const useModal = () => useContext(ModalContext)

export function ModalProvider({ children }) {
  const [modalData, setModalData] = useState(null)

  const showModal = useCallback(({ title, message, confirmText = 'Confirm', onConfirm, isDanger = false }) => {
    setModalData({ title, message, confirmText, onConfirm, isDanger })
  }, [])

  const closeModal = useCallback(() => {
    setModalData(null)
  }, [])

  const handleConfirm = () => {
    if (modalData?.onConfirm) {
      modalData.onConfirm()
    }
    closeModal()
  }

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{modalData.title}</div>
            <div className="modal-body">{modalData.message}</div>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={closeModal}>Cancel</button>
              <button 
                className={`modal-btn-confirm ${modalData.isDanger ? 'danger' : ''}`} 
                onClick={handleConfirm}
              >
                {modalData.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}
