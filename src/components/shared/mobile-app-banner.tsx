import Image from "next/image";
import { cn } from "@/lib/utils";
import logodark from "../../../public/authicon/logodark.svg";

/** Mobile HalalWalls app promo — shared by homepage and profile */
export function MobileAppBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[120px] items-center justify-center gap-[22px] rounded-xl border border-hw-green/40 bg-[#CBFFEB] p-3 lg:hidden",
        className,
      )}
    >
      <div className="grid shrink-0">
        <span className="text-lg font-bold text-hw-green">
          <Image src={logodark} alt="HalalWalls" className="w-[84px]" />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[20px] font-bold text-black">HalalWalls App</p>
        <p className="text-[12px] text-black">Download wallpapers on the go</p>
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-[150px] shrink-0 items-center gap-2 rounded-lg bg-hw-pill px-3 py-2"
        >
          <Image
            src="/google-play-logo.png"
            alt=""
            width={16}
            height={16}
            className="size-6 object-contain"
          />
          <div>
            <p className="text-[10px] font-semibold">Get it on</p>
            <p className="text-[13px] font-semibold">Google Play</p>
          </div>
        </a>
      </div>
    </div>
  );
}
