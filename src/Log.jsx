import React, { useState, useEffect } from "react";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";

const Log = () => {
  const token = localStorage.getItem("token");
  const claims = jose.decodeJwt(token);
  const navigate = useNavigate();

  // Logout function start
  const Logout = () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        localStorage.removeItem("token");
      }

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  // Logout function end

  return (
    <>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <div className="dropdown dropdown-left hover:bg-transparent ">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost  rounded-full  hover:bg-transparent  "
              >
                <img
                  className=" w-12 rounded-full border-4 border-l-primary border-r-secondary border-t-accent border-b-neutral   "
                  src={`https://robohash.org/${claims.name}?set=set3`}
                  alt=""
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 bg-transparent w-full h-full    "
              >
                <li>
                  <div className="ml-24  rounded-full bg-base-100  shadow-lg hover:bg-base-100  border-4 border-transparent p-4 w-full flex  animate__animated animate__fadeInDown ">
                    <img
                      className=" w-12 rounded-full border-4 border-l-primary border-r-secondary border-t-accent border-b-neutral   "
                      src={`https://robohash.org/${claims.name}?set=set3`}
                      alt=""
                    />
                    <h1 className="text-xl rounded-full px-4  font-bold mb-4 ml-4  border-4 border-transparent border-x-info">
                      {claims.name}
                    </h1>
                    <button
                      onClick={() =>
                        document.getElementById("my_modal_4").showModal()
                      }
                      className="rounded-full px-4  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-error"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      <div className="text-error font-bold">Logout</div>
                    </button>
                  </div>
                </li>
                <li>
                  <a></a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 hover:text-error "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </form>
          <h3 className="font-bold text-lg"></h3>
          <p className="py-4 text-error text-3xl font-bold">Logout ?</p>

          <button
            onClick={Logout}
            className="btn mt-2 btn-circle w-full  right-0 text-error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </dialog>
    </>
  );
};

export default Log;
