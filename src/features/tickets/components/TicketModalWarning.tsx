import { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TicketModalWarningProps = {
    isOpen: boolean;
    onClose: () => void,
    ticketTitle: string,
    onClick: () => void
}

export function TicketModalWarning({ isOpen, onClose, ticketTitle, onClick }: TicketModalWarningProps) {
    const [isEqualInput, setIsEqualInput] = useState(false)
    const inputTestText = `BORRAR ${ticketTitle}`

    const handleClick = () => {
        onClick()
        onClose()
    }

    return (
        <Modal
            description="¿Estás seguro de que quieres cerrar este modal? Se perderán todos los cambios no guardados."
            isOpen={isOpen}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose();
            }}
            primaryAction={{
                label: "Borrar ticket",
                onClick: handleClick,
                disabled: !isEqualInput,
            }}
            secondaryAction={{
                label: "Cancelar",
                onClick: onClose,
            }}
            title={"Estas a punto de borrar un ticket"}
        >
            <div className="flex flex-col gap-4">
                <p className="flex w-full justify-center">
                    Para confirmar que quieres borrar el ticket {`"${ticketTitle}"`}, escribe:
                </p>
                <p className="font-bold flex w-full justify-center bg-accent">
                    {`"${inputTestText}"`}
                </p>
                <Input
                    className={cn({
                        "border-red-500": !isEqualInput,
                        "border-green-500": isEqualInput,
                    })}
                    onChange={(e) => setIsEqualInput(e.target.value === inputTestText)}
                    placeholder={inputTestText}
                />
            </div>
        </Modal>
    )
}