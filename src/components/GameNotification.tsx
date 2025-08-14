import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Zap, Trophy, Target, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'task_completed' | 'streak' | 'productivity' | 'milestone';
  points: number;
}

interface GameNotificationProps {
  achievement?: Achievement;
  message?: string;
  type?: 'success' | 'achievement' | 'streak' | 'milestone' | 'error' | 'warning';
  points?: number;
  onClose?: () => void;
  duration?: number;
}

const achievementIcons = {
  task_completed: CheckCircle,
  streak: Flame,
  productivity: Zap,
  milestone: Trophy,
  default: Star
};

export function GameNotification({ 
  achievement, 
  message, 
  type = 'success', 
  points = 0,
  onClose,
  duration = 3000 
}: GameNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    if (achievement) {
      const IconComponent = achievementIcons[achievement.type] || achievementIcons.default;
      return <IconComponent className="h-6 w-6" />;
    }
    
    switch (type) {
      case 'achievement':
        return <Trophy className="h-6 w-6" />;
      case 'streak':
        return <Flame className="h-6 w-6" />;
      case 'milestone':
        return <Target className="h-6 w-6" />;
      default:
        return <CheckCircle className="h-6 w-6" />;
    }
  };

  const getAnimation = () => {
    switch (type) {
      case 'achievement':
        return 'task-celebration';
      case 'streak':
        return 'task-glow';
      case 'milestone':
        return 'task-bounce';
      default:
        return 'task-enter';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300';
      case 'streak':
        return 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-orange-300';
      case 'milestone':
        return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white border-purple-300';
      default:
        return 'bg-gradient-to-r from-green-400 to-blue-500 text-white border-green-300';
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 25,
          duration: 0.3
        }}
        className={cn(
          "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-2 min-w-[300px] max-w-md",
          getColors(),
          getAnimation()
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 animate-bounce">
            {getIcon()}
          </div>
          
          <div className="flex-1">
            {achievement ? (
              <>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  🏆 {achievement.title}
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    +{achievement.points} pts
                  </span>
                </h3>
                <p className="text-sm opacity-90 mt-1">{achievement.description}</p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {message}
                  {points > 0 && (
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full animate-pulse">
                      +{points} pts
                    </span>
                  )}
                </h3>
              </>
            )}
          </div>
          
          <button
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Animated progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="h-full bg-white/40"
          />
        </div>

        {/* Confetti animation for special achievements */}
        {(type === 'achievement' || type === 'milestone') && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0, rotate: 0 }}
                animate={{ 
                  opacity: 0, 
                  y: -100, 
                  rotate: 360,
                  x: Math.random() * 100 - 50 
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  i % 3 === 0 ? "bg-yellow-300" : i % 3 === 1 ? "bg-blue-300" : "bg-pink-300"
                )}
                style={{
                  left: `${20 + i * 10}%`,
                  top: "50%"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}