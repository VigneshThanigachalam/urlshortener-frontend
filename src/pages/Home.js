import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import { MetaData } from "../components/MetaData";
import { CgArrowRight } from "react-icons/cg";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";



export const Home = () => {
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URI;
  const [cookie, setCookie] = useCookies(["refreshToken"]);
  const CategorySchema = Yup.object().shape({
    url: Yup.string().required("Please paste the url")
  });

  return (
    <>
      <MetaData title="Home" />
      <Container class1={"cart-wrapper home-wrapper-2"}>
        <div className="row my-5 flex-wrap-reverse justify-content-center">
          <div className="col-8 my-5 pt-4">
            <div className="auth-card mx-auto">
              <h3 className="text-center">URL Shortener</h3>
              <p className="text-center">Simply your link, track and manage them</p>
              <Formik
                initialValues={{
                  url: "",
                }}
                validationSchema={CategorySchema}
                onSubmit={(values, { resetForm }) => {
                  toast.loading("Please wait", {
                    progressClassName: "success-progress-bar",
                    toastId: 2,
                  });
                  const postURL=`${base_url}/create/short`;
              fetch(postURL, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  token: cookie.refreshToken,
                },
                body: JSON.stringify({
                  // We should keep the fields consistent for managing this data later
                  origUrl: values.url
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.message === "successfully Trimmed") {
                    setCookie("refreshToken", data.token);
                    resetForm();
                    toast.update(2, {
                      render: "successfully Trimmed",
                      type: "success",
                      hideProgressBar: false,
                      autoClose: 1000,
                      isLoading: false,
                    });
                    navigate("/saved-url");
                  } else {
                    toast.update(2, {
                      render: data.message,
                      type: "warning",
                      hideProgressBar: false,
                      autoClose: 5000,
                      isLoading: false,
                    });
                  }
                })
                .catch((err) => {
                  toast.update(2, {
                    render: "Failed to Fetch",
                    type: "error",
                    hideProgressBar: false,
                    autoClose: 5000,
                    isLoading: false,
                  });
                });
                  // navigate("/saved");
                }}>
                {({ errors, values, touched }) => (
                  <Form className="d-flex flex-column gap-15 py-0 py-md-5">
                    <Field
                      type="text"
                      className="form-control"
                      name="url"
                      placeholder="https://mail.google.com"
                      autoComplete="off"
                    />
                    {(errors.url && touched.url)?(
                      <div className="text-danger">
                        <i className="bi bi-info-circle"></i>
                        {` ${errors.url}`}
                      </div>
                    ) : null}
                    <div>
                      <div className="mt-3 d-flex gap-15 justify-content-center align-items-center">
                        <button className="button border-0" type="submit">
                          <CgArrowRight />
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
