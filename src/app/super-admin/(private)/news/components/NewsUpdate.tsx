"use client";

import { routes } from "@/config/routes";
import { useGetAllNewsQuery, useGetNewsQuery, useUpdateNewsMutation } from "@/features/super-admin/news/newsApi";
import { Form, Formik } from "formik";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { PiSpinnerLight } from "react-icons/pi";
import * as Yup from "yup";
import NewsForm from "./NewsForm";

export default function NewsUpdate({ newsId }: { newsId: number }) {
  const router = useRouter();
  const { data, isLoading } = useGetNewsQuery(newsId);
  const { refetch } = useGetAllNewsQuery(undefined);
  const [newsImage, setNewsImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateNews, { isSuccess: newsSuccess, isError: newsError }] = useUpdateNewsMutation();
  const [initialValues, setInitialValues] = useState({
    title: "",
    league: "",
    shortDescription: "",
    description: "",
    imageType: "url",
    image: "",
    publishDate: "",
    status: "1"
  });

  useEffect(() => {
    if (!isLoading) {
      const news = data?.data;
      setInitialValues((prev) => {
        return {
          ...prev,
          ...news,
          publishDate: news?.publishDate ? moment(news?.publishDate).format("YYYY-MM-DD") : ""
        };
      });
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (newsError) {
      setIsSubmitting(false);
      toast.error("Something went wrong!");
    }
    if (newsSuccess) {
      setIsSubmitting(false);
      refetch();
      toast.success("News updated successfully!");
      router.push(routes.admin.news.home);
    }
  }, [newsError, newsSuccess, refetch, router]);

  const newsSchema = Yup.object().shape({
    title: Yup.string().required("Required!"),
    league: Yup.string().required("Required!"),
    description: Yup.string().required("Required!"),
    shortDescription: Yup.string().required("Required!"),
    imageType: Yup.string().required("Required!"),
    imageUrl: Yup.string().when("news_image_type", {
      is: "url",
      then: () => Yup.string().url("Provide a valid image url!").required("Required!")
    }),
    publishDate: Yup.string().required("Required!"),
    status: Yup.string().required("Required!")
  });

  // News Handler
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    let formBody = new FormData();

    formBody.append("title", values?.title);
    formBody.append("league", values?.league);
    formBody.append("shortDescription", values.shortDescription);
    formBody.append("description", values.description);
    formBody.append("imageType", values.imageType);
    newsImage ? formBody.append("image", newsImage) : formBody.append("imageUrl", values?.image);
    formBody.append("publishDate", values.publishDate);
    formBody.append("status", values.status);

    updateNews({
      id: newsId,
      data: formBody
    });
  };

  return (
    <div className='flex-grow pb-10'>
      <div className='grid grid-cols-1 gap-8 @2xl:gap-10 @3xl:gap-12'>
        <Formik initialValues={initialValues} validationSchema={newsSchema} enableReinitialize onSubmit={handleSubmit}>
          {({ values, setFieldValue, errors }) => {
            return (
              <Form>
                <NewsForm
                  values={values}
                  setFieldValue={setFieldValue}
                  newsImage={newsImage}
                  setNewsImage={setNewsImage}
                />

                <div className='mt-6 flex justify-end'>
                  <button type='submit' className='btn btn-primary btn-sm rounded-md  ' disabled={isSubmitting}>
                    Update{" "}
                    {isSubmitting ? (
                      <PiSpinnerLight className='ml-1 animate-spin' />
                    ) : (
                      <FiCheckCircle className='ml-1' />
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
