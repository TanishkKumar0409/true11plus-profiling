"use client";

import { motion } from "framer-motion";
import { StudentCardAnimated } from "./_students_components/StudentCardAnimated";
import { useCallback, useEffect, useState } from "react";
import { UserProps } from "@/types/UserProps";
import { getErrorResponse } from "@/contexts/Callbacks";
import { API } from "@/contexts/API";
import StudentdsSkeleton from "@/ui/loading/pages/StudentsSkeleton";

export default function StudentMasonryDirectory() {
  const [students, setStudents] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const getAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/users/role/student`);
      setStudents(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  if(loading)return <StudentdsSkeleton/>

  return (
    <div className="min-h-screen bg-(--secondary-bg) selection:bg-(--blue-subtle)">
      <main className="px-4 sm:px-8 py-16 md:py-24 ">
        {/* Header Section */}
        <header className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="h-px w-8 bg-(--main) rounded-full" />
            <span className="text-(--main) font-black text-xs uppercase tracking-[0.3em]">
              Directory ${new Date().getFullYear()}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-(--text-color-emphasis) tracking-tighter"
          >
            Meet the <br />
            <span className="text-main-gradient">Brightest</span> Minds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-(--text-color) mt-6 text-lg font-medium"
          >
            A curated list of top students ready to build the next big thing.
          </motion.p>
        </header>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {students?.map((student, idx) => (
            <StudentCardAnimated key={idx} student={student} index={idx} />
          ))}
        </div>
      </main>
    </div>
  );
}
