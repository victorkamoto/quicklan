import { useEffect } from "react";
import { GetLocalDetails, RunScanner } from "../wailsjs/go/main/App";
import { EventsOn } from "../wailsjs/runtime/runtime";
import { UserNav } from "./components/user-account-nav";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Host, store } from "./store/store";
import { Hosts } from "./components/hosts";
import { HostView } from "./components/hostView";
import { HostViewQueue } from "./components/hostViewQueue";

function App() {
  const host = store((state) => state.user);
  const setUser = store((state) => state.setUser);
  const addHost = store((state) => state.addHost);
  const updateIp = store((state) => state.updateIp);
  const setScanFinished = store((state) => state.setFinishedScan);
  const updateProgress = store((state) => state.updateProgress);

  useEffect(() => {
    EventsOn("local:ip", (data: any) => {
      updateIp(data);
    });
    EventsOn("host:up", (data: any) => {
      let host: Host = {
        username: "vic",
        host: "devpc",
        homeDir: "/home/vic",
        avatar: "",
        ip: data,
      };
      addHost(host);
    });
    EventsOn("scan:done", (data: any) => {
      setScanFinished(true);
    });
    EventsOn("file:progress", (data: any) => {
      updateProgress(data.jobId, data.sent, data.total, data.percentage);
    });

    const getLocalDetails = async () => {
      const details = await GetLocalDetails();
      setUser(details as Host);
    };
    const getHosts = async () => {
      await RunScanner();
    };
    getLocalDetails();
    getHosts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b border-slate-200">
        <div className="container flex h-16 items-center justify-between py-4">
          <nav></nav>
          <UserNav
            user={{
              username: host?.username,
              avatar: "",
              ip: host?.ip,
              host: host?.host,
              homeDir: host?.homeDir,
            }}
          />
        </div>
      </header>
      <main className="min-h-[375px] p-2 flex flex-col px-4">
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Hosts />} />
            <Route path="/host" element={<HostView />} />
            <Route path="/queue" element={<HostViewQueue />} />
          </Routes>
        </MemoryRouter>
      </main>
      <footer className="min-h-[60px] border-t border-slate-200"></footer>
    </div>
  );
}

export default App;
