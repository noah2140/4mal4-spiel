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
            x: [1, -1, -2, 1, 1, -1, -2, 1, -1, 2, 1],
            y: [2, -1, 0, 2, -1, 1, 1, 1, -1, 1, -2],
            rotate: [0, -0.2, 0.2, 0, 0.2, -0.2, 0, -0.2, 0.2, 0, -0.2],
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
