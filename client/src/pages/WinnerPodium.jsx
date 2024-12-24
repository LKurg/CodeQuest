import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion'; // Note: You'll need to install framer-motion

const WinnerPodium = ({ topPlayers }) => {
  // Ensure we only use top 3 players
  const winners = topPlayers.slice(0, 3);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4
      }
    }
  };

  const getMedalColor = (position) => {
    switch (position) {
      case 0: return "text-yellow-400";
      case 1: return "text-gray-300";
      case 2: return "text-amber-700";
      default: return "text-gray-400";
    }
  };

  const getPodiumHeight = (position) => {
    switch (position) {
      case 0: return "h-64";
      case 1: return "h-52";
      case 2: return "h-40";
      default: return "h-32";
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="w-full max-w-4xl p-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-white mb-12"
          variants={itemVariants}
        >
          <Trophy className="inline-block mr-4 text-yellow-400" size={48} />
          Winners
        </motion.h2>

        <div className="flex justify-center items-end gap-4 h-96">
          {/* Second Place */}
          <motion.div 
            className="w-64 flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="mb-4">
              <div
                className="w-24 h-24 rounded-full overflow-hidden bg-white/10 mb-2"
                dangerouslySetInnerHTML={{ 
                  __html: winners[1]?.avatar || ''
                }}
              />
              <div className="text-xl font-bold text-white">{winners[1]?.name}</div>
              <div className="text-2xl font-bold text-gray-300">
                <Medal className="inline-block mr-2" />
                {winners[1]?.score} pts
              </div>
            </div>
            <div className={`w-full ${getPodiumHeight(1)} bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg`} />
          </motion.div>

          {/* First Place */}
          <motion.div 
            className="w-64 flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="mb-4 transform -translate-y-8">
              <div
                className="w-32 h-32 rounded-full overflow-hidden bg-white/10 mb-2 border-4 border-yellow-400"
                dangerouslySetInnerHTML={{ 
                  __html: winners[0]?.avatar || ''
                }}
              />
              <div className="text-2xl font-bold text-white">{winners[0]?.name}</div>
              <div className="text-3xl font-bold text-yellow-400">
                <Trophy className="inline-block mr-2" />
                {winners[0]?.score} pts
              </div>
            </div>
            <div className={`w-full ${getPodiumHeight(0)} bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg`} />
          </motion.div>

          {/* Third Place */}
          <motion.div 
            className="w-64 flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="mb-4">
              <div
                className="w-24 h-24 rounded-full overflow-hidden bg-white/10 mb-2"
                dangerouslySetInnerHTML={{ 
                  __html: winners[2]?.avatar || ''
                }}
              />
              <div className="text-xl font-bold text-white">{winners[2]?.name}</div>
              <div className="text-2xl font-bold text-amber-700">
                <Medal className="inline-block mr-2" />
                {winners[2]?.score} pts
              </div>
            </div>
            <div className={`w-full ${getPodiumHeight(2)} bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg`} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinnerPodium;