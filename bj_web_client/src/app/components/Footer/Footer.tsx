import React, { useState } from "react";
import "./Footer.css";
import { motion } from "framer-motion";
export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const footerVariants = {
    hidden: {
      y: 0,
    },
    visible: {
      y: -200,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.footer className="footer">
      <h5>INFORMATIONS</h5>
      <motion.div className="footer-line line_big" />
      <motion.div className="footer-line line_small" />
      <motion.div className="footer_container">
        <motion.div className="footer_jik-wrapper">
          <h1 className="footer-jik">JIK</h1>
          <h5 className="footer-text">ORIGINAL</h5>
        </motion.div>
        <motion.div className="footer_riddlezone-wrapper">
          <motion.div className="riddlezone-wrapper">
            <h1 className="footer-ridddlezone">RIDDLEZONE</h1>
          </motion.div>
        </motion.div>
        <h5 className="footer-text">DESIGNED BY MATEUSZ KRETKOWSKI</h5>
        <h5 className="footer-text">
          CREATED AND CODED BY MAREK KRETKOWSKI AND MATEUSZ KRETKOWSKI
        </h5>
      </motion.div>
    </motion.footer>
  );
}
