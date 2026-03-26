import React from "react";
import { ExternalToast, toast, Toaster, ToasterProps } from "sonner";
import { createContextWithWrite } from "../../contexts/createContextWithWrite";

type ToastOptionsType = {
  position?: ToasterProps["position"];
};

const reducer = (
  currentState: ToastOptionsType,
  newState: Partial<ToastOptionsType>,
) => ({
  ...currentState,
  ...newState,
});

const defaultToastState: ToastOptionsType = {
  position: "bottom-left",
};

// eslint-disable-next-line react-refresh/only-export-components
const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const value = ToastContext.useValue();

  return (
    <>
      {children}
      <Toaster position={value.position ?? "bottom-left"} />
    </>
  );
};

const ToastContext = createContextWithWrite<
  ToastOptionsType,
  Partial<ToastOptionsType>
>("Toast", reducer, ToastContainer);

type ToastProviderProps = {
  children: React.ReactNode;
  value?: ToastOptionsType;
};

export const Toast = {
  Provider: ({ children, value = defaultToastState }: ToastProviderProps) => (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  ),
  useToast: () => (message: React.ReactNode, options?: ExternalToast) => {
    toast(message, options);
  },
};
