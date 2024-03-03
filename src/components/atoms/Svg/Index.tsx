import { SVGProps } from '@/types/common/common';

export function GoogleIcon(props: SVGProps) {
  return (
    <svg {...props} viewBox="0 0 22 22" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.9998 11.2268C21.0006 10.5407 20.9385 9.85589 20.8142 9.18066H11.2012V13.0488H16.6931C16.5791 13.66 16.34 14.2422 15.99 14.7603C15.6401 15.2785 15.1866 15.7217 14.6571 16.0634V18.573H17.9544C19.8837 16.8321 20.9969 14.2678 20.9969 11.2249L20.9998 11.2268Z"
        fill="#3E82F1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2039 20.9993C13.959 20.9993 16.2691 20.1043 17.9571 18.5772L14.6598 16.0676C13.7456 16.6677 12.5767 17.0228 11.2039 17.0228C8.54591 17.0228 6.29645 15.2631 5.49472 12.8994H2.08496V15.491C2.93436 17.1474 4.23699 18.5398 5.84733 19.5125C7.45766 20.4852 9.31226 21 11.2039 20.9993Z"
        fill="#32A753"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.49502 12.8993C5.06819 11.6673 5.06819 10.3318 5.49502 9.09992V6.5083H2.08526C1.37162 7.90217 1 9.44011 1 10.9996C1 12.5591 1.37162 14.097 2.08526 15.4909L5.49502 12.8993Z"
        fill="#F9BB00"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.204 4.97645C12.7026 4.97645 14.0475 5.48139 15.1049 6.47244L18.0312 3.60386C16.2643 1.99011 13.9543 1 11.2059 1C9.31421 0.999311 7.45961 1.51408 5.84928 2.48679C4.23895 3.4595 2.93631 4.85184 2.08691 6.50824L5.49667 9.09986C6.2984 6.73622 8.54786 4.97645 11.2059 4.97645H11.204Z"
        fill="#E74133"
      />
    </svg>
  );
}

export function AddConfIcon(props: SVGProps, color?: string) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 13V6C20 3.79086 18.2091 2 16 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H11"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M8 7H16" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 11H14" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 19H20"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 16L17 22"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FolderIcon(props: SVGProps, color = 'black') {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5793 17.1555C20.0217 14.7345 20.0495 12.2559 19.6616 9.8256L19.5975 9.42416C19.4303 8.37679 18.5269 7.60612 17.4663 7.60612L10.7534 7.60612C10.7206 7.60612 10.6941 7.57955 10.6941 7.54677C10.6941 6.55444 9.88961 5.75 8.89728 5.75H6.60572C5.50252 5.75 4.57329 6.57432 4.44176 7.66965L4.16927 9.93877C3.88559 12.3011 3.9588 14.6927 4.38646 17.0333C4.56098 17.9885 5.35982 18.7045 6.32833 18.7738L7.84234 18.8821C11.2724 19.1275 12.7157 19.1275 16.1458 18.8821L17.7836 18.7649C18.6792 18.7008 19.4179 18.0387 19.5793 17.1555Z"
        stroke="#C0C0C2"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TrashIcon(props: SVGProps, color?: string) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.2399 6.94478C6.26803 6.69157 6.48206 6.5 6.73684 6.5H17.2632C17.5179 6.5 17.732 6.69157 17.7601 6.94478L17.9602 8.74613C18.321 11.9931 18.321 15.2701 17.9602 18.517L17.9405 18.6944C17.8091 19.8769 16.8926 20.8199 15.7143 20.9849C13.2501 21.3299 10.7499 21.3299 8.28574 20.9849C7.10737 20.8199 6.19085 19.8769 6.05945 18.6944L6.03975 18.517C5.67897 15.2701 5.67897 11.9931 6.03975 8.74613L6.2399 6.94478Z"
        stroke="#C0C0C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 12L10 16"
        stroke="#C0C0C2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 16L10 12"
        stroke="#C0C0C2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.5 3.5H19.5"
        stroke="#C0C0C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 2L15 2"
        stroke="#C0C0C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VideoIcon(props: SVGProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.96638 5.81396C9.31916 5.60359 11.6868 5.62195 14.036 5.86878L14.6438 5.93264C15.8037 6.05451 16.7372 6.93433 16.9314 8.07943L20.2098 6.33767C20.432 6.21964 20.6985 6.22085 20.9196 6.34091C21.1407 6.46097 21.2868 6.68388 21.3088 6.9345L21.3337 7.21834C21.6126 10.4 21.6126 13.6 21.3337 16.7817L21.3088 17.0655C21.2868 17.3161 21.1407 17.539 20.9196 17.6591C20.6985 17.7791 20.432 17.7804 20.2098 17.6623L16.9314 15.9206C16.7372 17.0657 15.8037 17.9455 14.6438 18.0674L14.036 18.1312C11.6868 18.3781 9.31916 18.3964 6.96638 18.1861L5.3846 18.0446C4.1927 17.9381 3.22968 17.0275 3.05657 15.8434C2.68394 13.2947 2.68394 10.7053 3.05657 8.15658C3.22968 6.97251 4.1927 6.06196 5.3846 5.95539L6.96638 5.81396ZM17.1164 14.3666C17.1966 14.3792 17.2762 14.4052 17.3519 14.4454L19.9069 15.8029C20.0882 13.2709 20.0882 10.7291 19.9069 8.19714L17.3519 9.55459C17.2762 9.59483 17.1966 9.62078 17.1164 9.63338C17.2566 11.208 17.2566 12.792 17.1164 14.3666Z"
        fill={props.color}
      />
    </svg>
  );
}
