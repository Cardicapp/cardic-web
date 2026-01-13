"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import moment from "moment";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axiosExtended from "@/lib/network/axios-extended";
import routes from "@/lib/network/routes";
import { setAuthToken, setUserInfo } from "@/store/authSlice";
import { getRedirect } from "@/lib/utils";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const router = useRouter();
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can remove this code block
    setLoading(true);

    const payload = {
      email: data.email,
      password: data.password,
    }
    
    try {
      const res = await axiosExtended.post(routes.adminLoginEmail, payload)
      if (res.status === 200) {
        deleteCookie('auth')
        deleteCookie('userId')
        deleteCookie('adminRoleId')
        setCookie("auth", res.data.token, {
          expires: moment().add(1, 'day').toDate(),
        })
        setCookie("userId", res.data.user.id, {
          expires: moment().add(1, 'day').toDate(),
        })
        if (res.data.user.adminRole)
          setCookie("adminRoleId", res.data.user.adminRole.id, {
            expires: moment().add(1, 'day').toDate(),
          })
        dispatch(setUserInfo(res.data.user))
        dispatch(setAuthToken(res.data.token))
        router.replace(getRedirect('/admin/dashboard'))
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false)
    }

    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
