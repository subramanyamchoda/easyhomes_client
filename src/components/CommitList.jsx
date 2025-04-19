import React, { useState, useEffect } from "react";
import axios from "axios";

const CommitList = () => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch commits on component mount
  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await axios.get("https://easyhomes.onrender.com/commit/getall");
        setCommits(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load commits");
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Commit List</h2>

      {loading && <p className="text-center">Loading commits...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Renter</th>
              <th className="px-4 py-2 text-left">Home</th>
              <th className="px-4 py-2 text-left">Screenshot</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {commits.map((commit) => (
              <tr key={commit._id}>
                <td className="px-4 py-2">
                  {commit.userId && typeof commit.userId === "object"
                    ? `${commit.userId.firstname} ${commit.userId.lastname}`
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {commit.renterId && typeof commit.renterId === "object"
                    ? `${commit.renterId.firstname} ${commit.renterId.lastname}`
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {commit.homeId?.title || "N/A"}
                </td>
                <td className="px-4 py-2">
                  {commit.screenshot ? (
                    <img
                      src={`https://easyhomes.onrender.com/${commit.screenshot}`}
                      alt="Screenshot"
                      style={{
                        maxWidth: "200px",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <p>No screenshot available</p>
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(commit.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommitList;
