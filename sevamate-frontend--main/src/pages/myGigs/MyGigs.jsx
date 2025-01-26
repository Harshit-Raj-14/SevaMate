import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser.id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  // Hardcoded plumber gig
  const hardcodedPlumberGig = {
    _id: "hardcoded-plumber-id",
    cover: "/img/plumber.jpg",
    title: "Professional Plumbing Services",
    price: "$150",
    sales: "0",
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
            {/* Render the hardcoded gig */}
            <tr key={hardcodedPlumberGig._id}>
              <td>
                <img
                  className="image"
                  src={hardcodedPlumberGig.cover}
                  alt="Plumber"
                />
              </td>
              <td>{hardcodedPlumberGig.title}</td>
              <td>{hardcodedPlumberGig.price}</td>
              <td>{hardcodedPlumberGig.sales}</td>
              <td>
                <img
                  className="delete"
                  src="./img/delete.png"
                  alt="Delete"
                  onClick={() =>
                    alert(
                      "This is a hardcoded gig and cannot be deleted."
                    )
                  }
                />
              </td>
            </tr>
            {/* Render dynamically fetched gigs */}
            {data.map((gig) => (
              <tr key={gig._id}>
                <td>
                  <img className="image" src={gig.cover} alt="" />
                </td>
                <td>{gig.title}</td>
                <td>{gig.price}</td>
                <td>{gig.sales}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
