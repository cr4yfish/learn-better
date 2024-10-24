"use server";

import { redirect } from "next/navigation";

import LevelScroller from "@/components/levelScroller/LevelScroller";
import Navigation from "@/components/utils/Navigation";
import Header from "@/components/utils/Header";

import { CurrentCourseProvider } from "@/hooks/SharedCourse";

import { getCurrentUser } from "@/utils/supabase/auth";
import { getUserCourse } from "@/utils/supabase/courses";
import { getCourseTopics } from "@/utils/supabase/topics";


export default async function Home() {

  const sessionState = await getCurrentUser();

  if(!sessionState) {
    redirect("/auth")
  }

  const currentCourse = sessionState.settings.current_course;
  const currentUserCourse = await getUserCourse(currentCourse.id);
  const initTopics = await getCourseTopics(currentCourse.id, 0, 10);

  return (
    <>
    <CurrentCourseProvider>
      <main className="flex flex-col justify-between items-center w-full h-screen ">
        <Header />
        <div id="scrollparent" className="relative w-full h-[90vh] overflow-y-auto pb-80">
          <LevelScroller initUserCourse={currentUserCourse} initTopics={initTopics} />
        </div>
      </main>
    </CurrentCourseProvider>
    <Navigation activeTitle="Home" />
    </>
  );
}
