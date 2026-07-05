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
import { cn } from "@/lib/utils";

export interface ModalAction {
  disabled?: boolean;
  label: React.ReactNode;
  onClick: () => void;
  type?: "button" | "submit";
}

export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  title: React.ReactNode;
}

export function Modal({
  children,
  className,
  description,
  isOpen,
  onOpenChange,
  primaryAction,
  secondaryAction,
  title,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        {children}

        {primaryAction || secondaryAction ? (
          <DialogFooter>
            {secondaryAction ? (
              <Button
                disabled={secondaryAction.disabled}
                onClick={secondaryAction.onClick}
                type={secondaryAction.type ?? "button"}
                variant="outline"
              >
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button
                disabled={primaryAction.disabled}
                onClick={primaryAction.onClick}
                type={primaryAction.type ?? "button"}
              >
                {primaryAction.label}
              </Button>
            ) : null}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

