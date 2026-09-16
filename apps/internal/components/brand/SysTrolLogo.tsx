"use client";

import React from "react";
import Image from "next/image";

interface SysTrolLogoProps {
  isCollapsed: boolean;
  onClick?: () => void;
  height?: number;
}

export const SysTrolLogo: React.FC<SysTrolLogoProps> = ({
  isCollapsed,
  onClick,
  height = 36,
}) => {
  const leftWidth = Math.round(height * (98 / 195));
  const rightWidth = Math.round(height * (124 / 195));
  const centerWidth = Math.round(height * (170 / 195));

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={isCollapsed ? "Click to expand sysTROL sidebar" : "Click to collapse sysTROL sidebar"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "flex-start",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(226, 232, 240, 0.8)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isCollapsed ? "0px" : "4px",
          transition: "gap 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            width: `${leftWidth}px`,
            height: `${height}px`,
            position: "relative",
            flexShrink: 0,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src="/images/logo-left.png"
            alt="sysTROL Mechanical Emblem"
            width={98}
            height={195}
            priority
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            maxWidth: isCollapsed ? "0px" : `${centerWidth + 12}px`,
            opacity: isCollapsed ? 0 : 1,
            overflow: "hidden",
            height: `${height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: `${centerWidth}px`,
              height: `${height}px`,
              position: "relative",
            }}
          >
            <Image
              src="/images/logo-center.png"
              alt="sysTROL Brand"
              width={170}
              height={195}
              priority
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        <div
          style={{
            width: `${rightWidth}px`,
            height: `${height}px`,
            position: "relative",
            flexShrink: 0,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src="/images/logo-right.png"
            alt="sysTROL Electrical Emblem"
            width={124}
            height={195}
            priority
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
};
