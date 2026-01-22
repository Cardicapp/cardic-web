"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setAuthToken, setUserInfo } from "@/store/authSlice";
import Colors from "@/theme/Colors";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import axiosExtended from "@/lib/network/axios-extended";
import routes from "@/lib/network/routes";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector(selectAuthState);
    const router = useRouter()
  const dispatch = useDispatch()
  const USER = {
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    img: "/images/user/user-03.png",
  };

   const logout = async () => {
    await serverLogout();
    dispatch(setUserInfo(null))
    dispatch(setAuthToken(null))
    deleteCookie('auth')
    router.replace('/admin/login')
  }

  const serverLogout = async () => {
    try {
      const res = await axiosExtended.post(`${routes.auth}/logout`)
      if (res.status === 200) return true;
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <div
            // src={USER.img}
            // className="size-12"
            // alt={`Avatar of ${USER.name}`}
            role="presentation"
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: Colors.Green
            }}
          // width={200}
          // height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          {/* <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          /> */}

          <div
            // src={USER.img}
            // className="size-12"
            // alt={`Avatar of ${USER.name}`}
            role="presentation"
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: Colors.Green
            }}
          // width={200}
          // height={200}
          />
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => {
              logout().then(() => setIsOpen(false))
            }}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}