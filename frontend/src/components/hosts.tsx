import { RunScanner } from "../../wailsjs/go/main/App";
import { Button } from "./ui/button";
import { UserAvatar } from "./user-avatar";
import { Icons } from "./icons";
import { useNavigate } from "react-router-dom";
import { store } from "../store/store";

export const Hosts = () => {
  const navigate = useNavigate();
  const hosts = store((state) => state.hosts);
  const clearHosts = store((state) => state.clear);
  const scanDone = store((state) => state.finishedScan);
  const setScanDone = store((state) => state.setFinishedScan);

  return (
    <>
      <div className="min-h-75px px-2">
        {scanDone ? (
          <div className="flex justify-between items-center px-2">
            <div className="flex space-x-1 cursor-default">
              <span className="text-sm text-slate-600">Finished scan</span>
              <Icons.check className="w-4 h-5 text-green-600" />
            </div>
            <div className="flex space-x-2">
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  setScanDone(false);
                  clearHosts();
                  RunScanner();
                }}
              >
                <Icons.refresh className="w-4 h-5" />
              </Button>
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/queue");
                }}
              >
                <Icons.queue className="w-4 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center px-2">
            <div className="flex space-x-2 cursor-default">
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
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/queue");
              }}
            >
              <Icons.queue className="w-4 h-5" />
            </Button>
          </div>
        )}
      </div>
      <div className="min-h-[310px] max-h-[310px] rounded-md mt-2 p-2 space-y-2 border border-slate-200 overflow-y-auto">
        {hosts.map((host, index) => (
          <div
            className="min-h-[70px] rounded-md flex cursor-pointer hover:bg-slate-100 border border-slate-100"
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
