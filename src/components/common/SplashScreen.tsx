import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Waves } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const dotVariants = {
  initial: {
    y: '0%',
  },
  animate: {
    y: '-50%',
  },
};

const dotTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

const SplashScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="relative mb-4">
          <Shield className="w-24 h-24 text-blue-300" />
          <Waves className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-12 h-12 text-white" />
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold tracking-wider"
        >
          FLOOD ALERT
        </motion.h1>
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-2 mt-8"
        >
          <motion.span
            className="block w-4 h-4 bg-blue-300 rounded-full"
            variants={dotVariants}
            transition={{ ...dotTransition, delay: 0 }}
          />
          <motion.span
            className="block w-4 h-4 bg-blue-300 rounded-full"
            variants={dotVariants}
            transition={{ ...dotTransition, delay: 0.2 }}
          />
          <motion.span
            className="block w-4 h-4 bg-blue-300 rounded-full"
            variants={dotVariants}
            transition={{ ...dotTransition, delay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
