import { LogInfo } from "../../wailsjs/runtime/runtime";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Job, store } from "../store/store";
import { Progress } from "./ui/progress";
import { pathBuilder } from "../lib/pathBuilder";
import { displayTitleHelper } from "../lib/displayTitleHelper";

export const HostViewQueue = () => {
  const jobs = store((state) => state.jobs);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tree = pathBuilder(pathname);

  return (
    <>
      <div className="min-h-75px px-2 flex justify-between items-center">
        <div>
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
      <div className="min-h-[310px] max-h-[310px] rounded-md mt-2 p-2 space-y-2 border border-slate-200 overflow-y-auto">
        <div className="flex flex-col space-y-2">
          <p className="text-sm pl-2">Your queue</p>
        </div>
        <hr />
        {jobs.map((job: Job) => {
          let title = displayTitleHelper(job.file);
          LogInfo(title);
          return (
            <div
              className="min-h-[70px] max-h-[70px] rounded-md flex cursor-pointer hover:bg-slate-100 border border-slate-100"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex flex-col justify-center w-full p-2">
                <div className="flex space-x-2 items-center">
                  <Icons.file className="min-w-4 min-h-5" />
                  <p className="text-sm truncate max-w-[3/4]">{title}</p>
                </div>
                <div className="flex space-x-2 justify-between items-center">
                  <Progress value={job.percentage} />
                  <span className="text-sm">{job.percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
