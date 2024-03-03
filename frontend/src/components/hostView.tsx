import { OpenFilesDialog, SendFileToServer } from "../../wailsjs/go/main/App";
import { Button } from "./ui/button";
import { UserAvatar } from "./user-avatar";
import { Icons } from "./icons";
import { useNavigate, useLocation } from "react-router-dom";
import { store } from "../store/store";
import { pathBuilder } from "../lib/pathBuilder";

export const HostView = () => {
  const addJob = store((state) => state.addJob);
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const host = state.host;
  const tree = pathBuilder(pathname);
  const handleOpenFile = async () => {
    const file = await OpenFilesDialog();
    const jobId = Math.floor(1000 + Math.random() * 9000).toString();
    addJob({
      jobId: jobId,
      host: host,
      file: file,
      finished: false,
      sent: 0,
      total: 0,
      percentage: 0,
    });
    SendFileToServer(jobId, host.ip, file);
    navigate("/queue", {
      state: { host: host },
    });
  };
  return (
    <>
      <div className="min-h-75px px-2 flex justify-between items-center">
        <div className="flex space-x-1">
          {tree.map((path, index) => (
            <div
              className="flex space-x-1 cursor-pointer hover:bg-slate-200 rounded-md w-16 p-1"
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
        <Button
          size={"icon"}
          variant={"ghost"}
          className="hover:bg-transparent hover:text-current cursor-default"
        ></Button>
      </div>
      <div className="min-h-[310px] max-h-[310px] rounded-md mt-2 p-2 space-y-2 border border-slate-200">
        <div className="flex p-2 px-3 cursor-default justify-between items-center">
          <div className="flex space-x-4 p-1">
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
        </div>
        <hr />
        <div className="flex flex-col space-y-2">
          <p className="text-sm pl-2">What do you want to do?</p>
          <Button variant={"outline"} onClick={handleOpenFile}>
            <span className="text-md text-slate-900">Send a file</span>
          </Button>
        </div>
      </div>
    </>
  );
};
