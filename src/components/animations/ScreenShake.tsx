import React from "react";
import { motion } from "framer-motion";

interface ScreenShakeProps {
  children: React.ReactNode;
  trigger: boolean;
}

const ScreenShake: React.FC<ScreenShakeProps> = ({ children, trigger }) => {
    const shakeVariants = {
        initial: { x: 0, y: 0, rotate: 0 },
        shake: {
            x: [2, -1, -2, 2, 1, -2, -1, 2, -1, 1, 2],
            y: [2, -1, 1, -1, -2, 1, -1, -2, -1, 2, -1],
            rotate: [0, -0.7, 0.7, 0, 0.7, -0.7, 0, -0.7, 0.7, 0, -0.7],
          transition: { duration: 0.5, ease: "easeInOut" },
        },
    };

    return (
        <motion.div
            variants={shakeVariants}
            initial="initial"
            animate={trigger ? "shake" : "initial"}
        >
        {children}
        </motion.div>
    );
};

export default ScreenShake;
