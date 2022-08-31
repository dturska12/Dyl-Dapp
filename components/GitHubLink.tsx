import styles from "../../styles/Thirdweb.module.css";
import React from "react";

export default function ThirdwebGuideFooter() {
  const url = "https://www.itslit.org/nft";
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: -120,
          right: -80,
          height: 300,
          width: 150,
          border: "1px solid #eaeaea",
          transform: "rotate(45deg)",
          backgroundColor: " #ff7b08",
          cursor: "pointer",
        }}
        role="button"
        onClick={() => window.open(url, "_blank")}
      />

      <div
        style={{
          position: "fixed",
          bottom: 4,
          right: 8,
        }}
      >
        <img
          src={"/image.png"}
          alt="Dyl Logo"
          width={75}
          height={75}
          role="button"
          style={{ cursor: "pointer" }}
          onClick={() => window.open(url, "_blank")}
        />
      </div>
    </>
  );
}
