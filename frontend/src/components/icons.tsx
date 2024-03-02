import { Cross1Icon } from "@radix-ui/react-icons";
import {
  ArrowRight,
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  ListStart,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { type JSX, type SVGProps } from "react";

export const Icons = {
  close: Cross1Icon,
  queue: ListStart,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  spinner: Loader2,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  chevronLeft: ChevronLeft,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  chevronRight: ChevronRight,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  stop: Ban,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  refresh: RotateCcw,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  arrowRight: ArrowRight,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  check: Check,
  hamburger: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-menu"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  user: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-user"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logo: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg
      fill="#000000"
      // width="800px"
      // height="800px"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>ReCast</title>
      <path d="M3.385 3.897l15.703 20.922-0.304-3.73 10.456 8.282-11.526-17.404 0.304 3.73-14.634-11.8zM4.843 3.041l16.717 7.313-1.073-2.295 8.437 0.865-11.293-6.35 1.073 2.295-13.861-1.829zM2.276 5.725l2.063 17.887 1.448-2.31 3.85 7.877-0.543-13.632-1.448 2.31-5.37-12.132z"></path>
    </svg>
  ),
  google: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  ),
  mailbox: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
      <polyline points="15,9 18,9 18,11" />
      <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" />
      <line x1="6" x2="7" y1="10" y2="10" />
    </svg>
  ),
};
