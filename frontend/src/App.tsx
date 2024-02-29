import { useState } from "react";
import { Greet } from "../wailsjs/go/main/App";
import { Button } from "./components/ui/button";
import { UserNav } from "./components/user-account-nav";
import { AvatarImage } from "@radix-ui/react-avatar";
import { UserAvatar } from "./components/user-avatar";

function App() {
  let user = {
    username: "user2",
    // avatar: "sdfsdf",
    host: "devpc",
    avatar: null,
    ip: "10.15.3.18",
  };
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b border-slate-200">
        <div className="container flex h-16 items-center justify-between py-4">
          <nav></nav>
          <UserNav
            user={{
              username: "Vic",
              avatar: "",
              ip: "10.15.0.200",
            }}
          />
        </div>
      </header>
      <main className="min-h-[375px] p-3 flex flex-col">
        <div className="min-h-75px px-2">
          <p className="text-sm">Scanning...</p>
        </div>
        <div className="min-h-[320px] rounded-md mt-2 p-2 space-y-2 border border-slate-200">
          <div className="min-h-[70px] rounded-md flex border border-slate-300">
            <div className="w-1/4 flex justify-center items-center">
              <UserAvatar
                user={{
                  username: user?.username ?? null,
                  avatar: user?.avatar ?? null,
                }}
                className="h-10 w-10"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-bold">{user.username}</p>
              <div className="flex space-x-2">
                <p className="font-sm">{user.host}</p>
                <p>|</p>
                <p className="font-sm">{user.ip}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="min-h-[60px] border-t border-slate-200"></footer>
    </div>
  );
}

export default App;
