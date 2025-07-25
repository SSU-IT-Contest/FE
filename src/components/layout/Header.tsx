"use client";

import { logout } from "@/apis/logout.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  const isLogin = useAuthStore((s) => s.isLogin);
  const authLogout = useAuthStore((s) => s.logout);
  const userName = useAuthStore((s) => s.userName);

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: (response) => {
      console.log("✅ 로그아웃 성공", response);
      authLogout();
    },
    onError: (err) => {
      console.error("❌ 로그아웃 실패: ", err.message);
      alert(err.message);
    },
  });

  return (
    <header className="z-50 flex px-[30px] py-[10px] justify-between items-center bg-main">
      <Link
        href="/"
        className="font-ghanachoco text-[34px] text-white [text-shadow:2px_4px_4px_rgba(0,0,0,0.5)]"
      >
        Phraiz
      </Link>
      {isLogin ? (
        <div className="flex gap-[15px]">
          <Link href="/my" className="flex items-center gap-[4px]">
            <Image src="/icons/avatar.svg" alt="" width={18} height={18} />
            <p className="text-white text-[18px] font-nanum-bold">
              {userName!} 님
            </p>
          </Link>
          <button
            onClick={() => logoutMutate()}
            className="bg-gradient-to-r from-white to-main backdrop-blur-md border-[0.2px] border-white/60 rounded-full py-[6px] px-[24px] hover:font-nanum-extrabold text-[14px]"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex gap-[10px] text-black text-[14px]">
          <Link href="/login" className="hover:font-nanum-extrabold">
            <div className="bg-gradient-to-r from-white to-main backdrop-blur-md border-[0.2px] border-white/60 rounded-full py-[6px] px-[24px]">
              로그인
            </div>
          </Link>
          <Link href="/sign-up" className="hover:font-nanum-extrabold">
            <div className="bg-gradient-to-r from-white to-main backdrop-blur-md border-[0.2px] border-white/60 rounded-full py-[6px] px-[24px]">
              회원가입
            </div>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
