import { type AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icons } from "./icons";

type User = {
  username: string | null;
  avatar: string | null;
};
interface UserAvatarProps extends AvatarProps {
  user: User;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.avatar ? (
        <AvatarImage alt="Picture" src={user.avatar} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.username}</span>
          <Icons.user />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
