"use server";

import { redirect } from "next/navigation";

import LevelScroller from "@/components/levelScroller/LevelScroller";
import Navigation from "@/components/utils/Navigation";
import Header from "@/components/utils/Header";

import { CurrentCourseProvider } from "@/context/SharedCourse";

import { getCurrentUser } from "@/utils/supabase/auth";
import { getUserCourse } from "@/utils/supabase/courses";
import { getCourseTopics } from "@/utils/supabase/topics";
import TeacherButton from "@/components/teacher/TeacherButton";


export default async function Home() {

  const sessionState = await getCurrentUser();

  if(!sessionState?.user?.id || !sessionState.profile) {
    redirect("/auth")
  }

  const currentCourse = sessionState.settings.current_course;

  if(!currentCourse) {
    // redirect to course selection
    redirect("/auth/course");
  }

  const currentUserCourse = await getUserCourse(currentCourse.id, sessionState.user.id);
  const initTopics = await getCourseTopics(currentCourse.id, 0, 10);

  return (
    <>
    <CurrentCourseProvider>
      <main className="flex flex-col items-center w-full h-screen ">
        <Header />
        <div className="absolute bottom-[110px] right-[30px]">
           <TeacherButton 
              course={currentCourse} 
              userProfile={sessionState.profile}
           />
        </div>
       
        <div id="scrollparent" className="relative w-full h-[90vh] overflow-y-auto pb-80">
          <LevelScroller initUserCourse={currentUserCourse} initTopics={initTopics} userId={sessionState.user.id} />
        </div>
      </main>
    </CurrentCourseProvider>
    <Navigation activeTitle="Home" />
    </>
  );
}
