import React, { useEffect, useState } from "react";
import "./Footer.css";
import { motion, useAnimation } from "framer-motion";
export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const footerVariants = {
    hidden: {
      y: 0,
    },
    visible: {
      y: -240,
      transition: {
        duration: 0.5,
      },
    },
  };
  const controls = useAnimation();
  useEffect(() => {
    isOpen ? controls.start("visible") : controls.start("hidden");
  })

  return (
    <motion.footer className="footer"
    variants={footerVariants}
    initial={controls}
    animate={controls}
    >
    <motion.div className="backdrop" style={{ opacity: isOpen ? 1 : 0 }} />
      <div className="footer-wrapper">
          <h5 className="grey-text" style={{ height: isOpen ? "0%" : "100%", opacity: isOpen ? 0 : 1 }}>INFORMATIONS</h5>
      <motion.div className="line-wrapper" onClick={() => {setIsOpen(!isOpen)} } >
        <motion.div className="footer-line line_small" />
      </motion.div>
      <motion.div className="footer_container">
        <motion.div className="footer_jik-wrapper">
          <motion.h1 className="footer-jik" style={{ opacity: isOpen ? 1 : 0 }} transition={{ delay: 4 }}>JIK</motion.h1> {/* there needs to be a photo of JIK Logo */}
          <motion.h5 className="footer-text" style={{ opacity: isOpen ? 1 : 0 }} transition={{ delay: 4 }}>ORIGINAL</motion.h5>
        </motion.div>
        <motion.div className="footer_riddlezone-wrapper">
          <motion.div className="riddlezone-wrapper">
            <motion.h1 className="footer-ridddlezone" style={{ opacity: isOpen ? 1 : 0 }}>RIDDLEZONE</motion.h1>
          </motion.div>
        <motion.h5 className="footer-text" style={{ opacity: isOpen ? 1 : 0 }}>DESIGNED BY MATEUSZ KRETKOWSKI</motion.h5>
        <motion.h5 className="footer-text" style={{ opacity: isOpen ? 1 : 0 }}>
          CODED BY MAREK KRETKOWSKI AND MATEUSZ KRETKOWSKI
        </motion.h5>
        <motion.h5 className="footer-text" style={{ opacity: isOpen ? 1 : 0 }}>
          COPYRIGHT © 2021 RIDDLEZONE. ALL RIGHTS RESERVED.
        </motion.h5>
        </motion.div>
      </motion.div>
      </div>
    </motion.footer>
  );
}
