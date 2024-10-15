"use client";

import { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";

import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import { upsertCourseTopic, getCourseTopics, getCurrentUser, getUserCourse } from "@/functions/client/supabase";
import { Topic, User_Course } from "@/types/db";

import EditCourseForm from "@/components/editCourse/editCourseForm";
import Icon from "@/components/Icon";

export default function EditCourse({ params: { course }} : { params: { course: string }}) {
  const [userCourse, setUserCourse] = useState<User_Course | undefined>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderUpdated, setOrderUpdated] = useState(false);

  useEffect(() => {
    const fetchUserCourse = async () => {
      const res = await getUserCourse(course);
      const sessionState = await getCurrentUser();
      res.user = sessionState?.user;

      const topics = await getCourseTopics(course, 0, 100);
      setTopics(topics);

      return res;
    }

    fetchUserCourse().then(setUserCourse);
  }, [course]);

  const updateOrder = async () => {
    setOrderUpdated(true);
    setLoadingOrder(true);
    topics.forEach(async (topic, index) => {
      topic.order = index;

      // remove the .chosen property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (topic as any).chosen

      await upsertCourseTopic(topic);
    })
    setOrderUpdated(false);
    setLoadingOrder(false);
  }

  return (
    <div className="px-4 py-6 overflow-y-auto h-full">
      {userCourse?.user && userCourse.course && 
        <EditCourseForm 
          userId={userCourse?.user.id} 
          isNew={false} 
          course={userCourse?.course} 
        />
      }

      <h2 className="font-bold text-2xl mb-2">Order Levels</h2>
      <ReactSortable list={topics} setList={setTopics} className=" overflow-y-auto max-h-[50vh] ">
        {topics?.map((topic) => (
          <Card key={topic.id} className=" mb-2  cursor-move select-none">
            <CardBody className="flex flex-row items-center justify-between">
              <span className="">{topic.title}</span>
              <Icon>drag_indicator</Icon>
            </CardBody>
          </Card>
        ))}
      </ReactSortable>
      <Button
        onClick={updateOrder}
        className="mt-4"
        color="primary"
        isLoading={loadingOrder}
        startContent={<Icon filled>{orderUpdated ? "save_circle" : "save"}</Icon>}
      >
        {orderUpdated ? "Order updated" : "Save Order"}
      </Button>
    </div>
  );
}