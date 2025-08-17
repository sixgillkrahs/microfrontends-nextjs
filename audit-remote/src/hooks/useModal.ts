import { useState } from "react"

export function useModal(): [boolean, () => void, () => void] {
    const [showModal, setShowModal] = useState<boolean>(false)
    const closeModal = () => {
        setShowModal(false)
    }
    const openModal = () => {
        setShowModal(true)
    }

    return [showModal, openModal, closeModal]
}
