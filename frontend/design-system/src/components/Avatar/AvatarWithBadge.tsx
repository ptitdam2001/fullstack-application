import { ReactNode } from "react";
import { cn } from "../../utils/cn";
import styled from "styled-components";
import { Avatar } from "./Avatar";
import { AvatarImage } from "./AvatarImage";
import { AvatarFallback } from "./AvatarFallback";
import { Badge } from "../Badge/Badge";

const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
`;

type BaseImageInfo = {
  label?: string;
  url?: string;
  content?: ReactNode;
  className?: string;
};

type AvatarWithBadgeProps = {
  badge: BaseImageInfo;
  avatar: BaseImageInfo;
  size?: "sm" | "md" | "lg";
};

export const AvatarWithBadge = ({
  badge,
  avatar,
  size = "md",
}: AvatarWithBadgeProps) => (
  <Container>
    <Avatar
      className={cn(avatar.className, {
        "size-10": size === "sm",
        "size-14": size === "md",
        "size-18": size === "lg",
      })}
    >
      <AvatarImage src={avatar.url} alt={avatar.label} />
      <AvatarFallback>{avatar.label}</AvatarFallback>
    </Avatar>
    <Badge className="absolute -bottom-2 -right-2 rounded-full bg-primary p-0">
      <Avatar
        className={cn(badge.className, {
          "size-4": size === "sm",
          "size-6": size === "md",
          "size-8": size === "lg",
        })}
      >
        <AvatarImage src={badge.url} alt={badge.label} />
        <AvatarFallback>{badge.content}</AvatarFallback>
      </Avatar>
    </Badge>
  </Container>
);
