import { useCallback, useEffect, useState } from "react";
import type { CategoryProps, StatusProps } from "../types/Types";
import { getErrorResponse } from "../contexts/Callbacks";
import { API } from "../contexts/API";

export default function useGetStatusAndCategory() {
  const [allStatus, setAllStatus] = useState<StatusProps[]>([]);
  const [allCategory, setAllCategory] = useState<CategoryProps[]>([]);

  const getAllStatus = useCallback(async () => {
    try {
      const response = await API.get("/status/all");
      setAllStatus(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);

  useEffect(() => {
    getAllStatus();
  }, [getAllStatus]);

  const getAllCategory = useCallback(async () => {
    try {
      const response = await API.get("/category/all");
      const data = response.data;
      const getCatById = (id: string) => {
        const found = data?.find((item: CategoryProps) => item?._id === id);
        return found?.category_name;
      };

      const finalData = data?.map((cat: CategoryProps) => {
        return {
          ...cat,
          parent_category: getCatById(cat?.parent_category),
        };
      });
      setAllCategory(finalData);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  return { allStatus, allCategory, getAllStatus, getAllCategory };
}
