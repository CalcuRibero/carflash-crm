export type PopupControls = {
  isOpen: boolean;
  primaryButton?: () => void;
  secondaryButton?: () => void;
};

export type PopupOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: React.ReactNode;
  secondaryLabel?: React.ReactNode;
};
