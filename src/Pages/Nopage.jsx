import React from "react";
import { Link } from "react-router-dom";

function Nopage() {
    return (
        <div className="content-grid">
            <main className="flex gap-4 flex-col items-center justify-center min-h-screen  text-white p-4">
                <div className="w-20 h-20 mb-8 text-muted-foreground"
                    aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <path
                            d="M6 2H13.586C13.851 2 14.1054 2.10536 14.2929 2.29289L19.7071 7.70711C19.8946 7.89464 20 8.149 20 8.414V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
                            fill="#E2E8F0"
                            stroke="#4A5568"
                            strokeWidth="1.5"
                        />

                        <circle cx="9" cy="13" r="1" fill="#4A5568" />
                        <circle cx="15" cy="13" r="1" fill="#4A5568" />
                        <path
                            d="M8.5 16C9.5 17.5 14.5 17.5 15.5 16"
                            stroke="#4A5568"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />

                        <path
                            d="M14 2V6C14 6.55228 14.4477 7 15 7H19"
                            fill="white"
                            stroke="#4A5568"
                            strokeWidth="1.5"
                        />

                    </svg>


                </div>


                <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
                <p className="text-xl mb-8 text-center max-w-md">
                    Oops! The page you're looking for seems to have vanished into thin
                    air.
                </p>
                <button className="rounded bg-black text-white px-4 py-3 hover:bg-black/90 transition-opacity" alt="Back_to_home">
                    <Link to="/">
                        Return to Home
                    </Link>
                </button>
            </main>
        </div>
    );
}

export default Nopage;