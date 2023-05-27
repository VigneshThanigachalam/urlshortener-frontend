import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { Container } from "../components/Container";
import { MetaData } from "../components/MetaData";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

export const SavedUrl = () => {
  const base_url = process.env.REACT_APP_BASE_URI;
  const [cookie, setCookie] = useCookies(["refreshToken"]);
  let [loading, setLoading] = useState(false);
  const [urllist, seturlList] = useState([]);

  useEffect(() => {
    const postURL = `${base_url}/url-user/saved-url`;
    fetch(postURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: cookie.refreshToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        seturlList(data.data);
        setLoading(false);
      })
      .catch((err) => toast.error("fetch failed"));
  }, []);
  return (
    <>
      {loading ? (
        <Container
          class1={
            "cart-wrapper home-wrapper-2 d-flex position-fixed top-50 start-50 translate-middle"
          }>
          <ClipLoader
            color={"orange"}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Container>
      ) : (
        <>
          <MetaData title="Saved Url" />

          <Container class1={"login-wrapper home-wrapper-2 py-5"}>
            {urllist ? ( <>
              <div className="d-flex  justify-content-between flex-wrap gap-4">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th scope="col">S no</th>
                      <th className="w-25" scope="col">Created Date</th>
                      <th className="w-25" scope="col">Visited Count</th>
                      <th className="w-25" scope="col">Url</th>
                    </tr>
                  </thead>
                  <tbody>

                    {urllist.map((v, index) => {
                      const url = `${base_url}/${v.urlId}`;
                      const date = new Date(v.date);
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td className="w-25">{`${date.getFullYear()} - ${date.getMonth()} - ${date.getDate()}`}</td>
                          <td className="w-25">{v.clicks}</td>
                          <td className="w-25"><Link to={url} target="blank">{url}</Link></td>
                        </tr>)
                    })

                    }
                  </tbody>
                </table>
              </div> </>) : (
              <div className="d-flex justify-content-center">
                <img src="images/empty-cart.jpg" className="img-fluid" width={400} />
              </div>)}
          </Container>
        </>
      )}
    </>
  );
};
