"use client";

// context/SharedStateContext.tsx
import { Course } from '@/types/db';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SharedStateContextType {
  currentCourse: Course | null;
  setCurrentCourse: (value: Course | null) => void;
}

const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

export const CurrentCourseProvider = ({ children }: { children: ReactNode }) => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  return (
    <SharedStateContext.Provider value={{ currentCourse, setCurrentCourse }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useCurrentCourse = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useCurrentCourse must be used within a CurrentCourseProvider');
  }
  return context;
};