"use client";

import { User_Course } from '@/types/db';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SharedStateContextType {
  userCourses: User_Course[];
  setUserCourses: (value: User_Course[]) => void;
}

const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

export const UserCoursesProvider = ({ children }: { children: ReactNode }) => {
  const [userCourses, setUserCourses] = useState<User_Course[]>([]);

  return (
    <SharedStateContext.Provider value={{ userCourses, setUserCourses }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useUserCourses = (initUserCourses?: User_Course[]) => {
  const context = useContext(SharedStateContext);

  if(initUserCourses) {
    context?.setUserCourses(initUserCourses)
  }
  

  if (!context) {
    throw new Error('useUserCourses must be used within a UserCoursesProvider');
  }
  return context;
};