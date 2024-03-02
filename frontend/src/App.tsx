import { useEffect, useState } from "react";
import { Greet, RunScanner } from "../wailsjs/go/main/App";
import { EventsOn, LogInfo } from "../wailsjs/runtime/runtime";
import { Button } from "./components/ui/button";
import { UserNav } from "./components/user-account-nav";
import { AvatarImage } from "@radix-ui/react-avatar";
import { UserAvatar } from "./components/user-avatar";
import { Icons } from "./components/icons";
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { atom, useAtom } from "jotai";

const hostsAtom = atom<User[]>([]);

type User = {
  username: string;
  host: string | null;
  avatar: string | null;
  ip: string;
};
function App() {
  useEffect(() => {
    const getHosts = async () => {
      await RunScanner();
    };
    getHosts();
  }, []);
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
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Hosts />} />
            <Route path="/host" element={<HostView />} />
          </Routes>
        </MemoryRouter>
      </main>
      <footer className="min-h-[60px] border-t border-slate-200"></footer>
    </div>
  );
}

const Hosts = () => {
  const navigate = useNavigate();
  const [hosts, setHosts] = useAtom(hostsAtom);
  const [scanDone, setScanDone] = useState(false);

  useEffect(() => {
    EventsOn("host:up", (data: any) => {
      let host: User = {
        username: "vic",
        host: "devpc",
        avatar: "",
        ip: data,
      };
      let exists = hosts.find((h) => h.ip === data);
      !exists && setHosts((hosts) => [...hosts, host]);
    });
    EventsOn("scan:done", (data: any) => {
      setScanDone(true);
    });
  }, []);

  return (
    <>
      <div className="min-h-75px px-2">
        {scanDone ? (
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <span className="text-sm text-slate-600">Finished scan</span>
              <Icons.check className="w-4 h-5 text-green-600" />
            </div>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => {
                setScanDone(false);
                setHosts([]);
                RunScanner();
              }}
            >
              <Icons.refresh className="w-4 h-5" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <span className="text-sm text-slate-600">Scanning</span>
              <svg
                aria-hidden="true"
                className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:bg-transparent hover:text-current"
            >
              {/* <Icons.stop className="w-4 h-5" /> */}
            </Button>
          </div>
        )}
      </div>
      <div className="min-h-[300px] rounded-md mt-2 p-2 space-y-2 border border-slate-200">
        {hosts.map((host, index) => (
          <div
            className="min-h-[70px] rounded-md flex border border-slate-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/host", {
                state: { host: host },
              });
            }}
          >
            <div className="w-1/4 flex justify-center items-center">
              <UserAvatar
                user={{
                  username: host?.username ?? null,
                  avatar: host?.avatar ?? null,
                }}
                className="h-10 w-10"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-bold">{host.username}</p>
              <div className="flex space-x-2">
                <p className="font-sm">{host.host}</p>
                <p>|</p>
                <p className="font-sm">{host.ip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const pathBuilder = (path: string) => {
  const chunks = path.split("/");
  if (chunks.length === 2) {
    return ["back"];
  } else {
    return chunks.slice(1);
  }
};

const HostView = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const host = state.host;
  const tree = pathBuilder(pathname);
  return (
    <>
      <div className="min-h-75px px-2">
        {tree.map((path, index) => (
          <div
            className="flex space-x-1 cursor-pointer hover:bg-slate-200 rounded-md w-14"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              if (path === "back") {
                navigate(-1);
              }
            }}
          >
            <Icons.chevronLeft className="w-4 h-5" />
            <span className="text-sm text-slate-600">{path}</span>
          </div>
        ))}
      </div>
      <div className="min-h-[300px] rounded-md mt-2 p-2 space-y-2 border border-slate-200">
        <div className="min-h-[300px] rounded-md flex flex-col space-y-2">
          <div className="flex p-2 border border-slate-200 rounded-md cursor-default">
            <div className="w-1/4 flex justify-center items-center">
              <UserAvatar
                user={{
                  username: host?.username ?? null,
                  avatar: host?.avatar ?? null,
                }}
                className="h-10 w-10"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-bold">{host.username}</p>
              <div className="flex space-x-2">
                <p className="font-sm">{host.host}</p>
                <p>|</p>
                <p className="font-sm">{host.ip}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col space-y-2">
            <p className="text-sm pl-2">What do you want to do?</p>
            <Button variant={"outline"} color="red">
              <span className="text-md text-slate-900">Send a file</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
