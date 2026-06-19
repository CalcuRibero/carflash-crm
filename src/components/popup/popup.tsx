"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PopupControls, PopupOptions } from "./type";


export function withPopup<TProps extends object>(
  Component: React.ComponentType<TProps>,
  options: PopupOptions = {},
) {
  const PopupComponent = ({
    isOpen,
    primaryButton,
    secondaryButton,
    ...props
  }: TProps & PopupControls) => {
    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!nextOpen && isOpen) {
          secondaryButton?.();
        }
      },
      [isOpen, secondaryButton],
    );

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton>
          {options.title || options.description ? (
            <DialogHeader>
              {options.title ? <DialogTitle>{options.title}</DialogTitle> : null}
              {options.description ? <DialogDescription>{options.description}</DialogDescription> : null}
            </DialogHeader>
          ) : null}

          <Component {...(props as TProps)} />

          {(primaryButton || secondaryButton) && (
            <DialogFooter>
              {secondaryButton ? (
                <Button type="button" variant="outline" onClick={secondaryButton}>
                  {options.secondaryLabel ?? "Cancel"}
                </Button>
              ) : null}
              {primaryButton ? (
                <Button type="button" onClick={primaryButton}>
                  {options.primaryLabel ?? "Confirm"}
                </Button>
              ) : null}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  PopupComponent.displayName = `withPopup(${Component.displayName || Component.name || "Component"})`;

  return PopupComponent;
}
