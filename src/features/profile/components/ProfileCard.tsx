"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProfileCardProps } from "../index";

// ProfileCard component
export function ProfileCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  isComingSoon = false,
}: ProfileCardProps) {
  const isInteractive = (!!href || !!onClick) && !isComingSoon;

  const content = (
    <div
      className={`relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-6 transition-all ${
        isInteractive
          ? "hover:border-amber-500/50 hover:bg-zinc-800/50 cursor-pointer"
          : "opacity-60 cursor-default"
      }`}
      // Only apply onClick if its interactive and not a link
      onClick={!href && isInteractive ? onClick : undefined}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-linear-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-8 h-8 text-amber-400" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      {/* Arrow */}
      {isInteractive && (
        <ChevronRight className="w-6 h-6 text-gray-500 shrink-0" />
      )}

      {/* Coming Soon Badge */}
      {isComingSoon && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-blue-900/50 border border-blue-700 rounded-full text-xs text-blue-300 font-semibold">
          Coming Soon
        </div>
      )}
    </div>
  );

  // If href is provided and the card is interactive wrap in Link
  if (href && isInteractive) {
    return (
      <Link href={href} className="group">
        {content}
      </Link>
    );
  }

  // Otherwise just return the div
  return content;
}
