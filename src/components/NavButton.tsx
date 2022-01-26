import React from "react";
interface Props {
  isNavClosed: boolean;
  onClick?: React.MouseEventHandler;
}

const NavButton: React.FC<Props> = ({ isNavClosed, onClick }) => {
  const toggleClassName = "opacity-0 scale-80";
  return (
    <button
      className={`${
        isNavClosed ? "bg-black/60" : "bg-blue"
      } fixed z-50 block w-16 h-16 text-white rounded-full md:w-20 md:h-20 top-4 right-4`}
      onClick={onClick}
    >
      <span className="sr-only">Open site navigation</span>
      <svg
        id="navbar-open-svg"
        width="24"
        height="24"
        fill="none"
        className={`absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform ${
          !isNavClosed ? toggleClassName : ""
        }`}
      >
        <path
          d="M4 8h16M4 16h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
      <svg
        width="24"
        height="24"
        fill="none"
        className={`absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform ${
          isNavClosed ? toggleClassName : ""
        }`}
      >
        <path
          id="navbar-close-svg"
          d="M6 18L18 6M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  );
};

export default NavButton;
