import * as React from "react";

type ImageStatus = "loading" | "loaded" | "error";

type AvatarContextValue = {
  imageStatus: ImageStatus;
  setImageStatus: (status: ImageStatus) => void;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const ctx = React.useContext(AvatarContext);
  if (!ctx) throw new Error("Avatar sub-components must be used within <Avatar>");
  return ctx;
}

export { AvatarContext, useAvatarContext, type ImageStatus };
