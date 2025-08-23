import React from 'react'
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white/40 flex justify-center items-center" onClick={onClose}>

            <div className="bg- white/90  p-[20px] rounded-md min-w-[300px] relative" onClick={(e) => e.stopPropagation()}>

                <button className="absolute top-[8px] right-[8px] border-none bg-none rounded-md p-1 text-[18px] cursor-pointer" onClick={onClose}>
                    ✖
                </button>

                {children}
            </div>
        </div>
    )
}

export default Modal