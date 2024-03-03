"use client";

import { Host } from "../store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
interface UserNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Host;
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            username: user.username ?? null,
            avatar: user.avatar ?? null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.username && (
              <p className="font-medium">Hi, {user.username}</p>
            )}
            {user.ip && (
              <p className="w-[100px] truncate text-sm text-muted-foreground">
                {user.ip}
              </p>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
