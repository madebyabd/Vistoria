"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <SignedIn>
          {/* Buy Credits Button */}
          <Link href="/credits">
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-400/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              <Image
                src="/assets/icons/bag.svg"
                alt="credits"
                width={20}
                height={20}
              />
              <span>Buy Credits</span>
            </Button>
          </Link>

          {/* User Button */}
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default TopBar;
