import { redirect } from "next/navigation";

import LevelScroller from "@/components/levelScroller/LevelScroller";
import Navigation from "@/components/utils/Navigation";
import Header from "@/components/utils/Header";

import { CurrentCourseProvider } from "@/hooks/SharedUserCourse";

import { getCurrentUser } from "@/utils/supabase/auth";


export default async function Home() {

  const sessionState = await getCurrentUser();

  if(!sessionState) {
    redirect("/auth")
  }

  return (
    <>
    <CurrentCourseProvider>
      <main className="flex flex-col justify-between items-center w-full min-h-full h-full ">
        <Header />
        <div className="relative w-full h-full">
          <LevelScroller  />
        </div>
      </main>
    </CurrentCourseProvider>
    <Navigation activeTitle="Home" />
    </>
  );
}
