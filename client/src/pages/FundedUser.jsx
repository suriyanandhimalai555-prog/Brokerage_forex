import { Edit, Trash } from "lucide-react";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

const badge = (value) => {
  if (value === "Verified")
    return "bg-green-100 text-green-700";

  if (value === "Not Verified")
    return "bg-red-100 text-red-600";

  if (value === "Active")
    return "bg-blue-100 text-blue-600";

  return "bg-gray-100 text-gray-600";
};

const safeValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return value;
};

const FundedUser = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

      const formattedUsers = (
        data.users || []
      ).map((u, index) => ({
        id:
          safeValue(u.id) || index + 1,

        name: safeValue(u.name),

        accId: safeValue(
          u.account_no
        ),

        email: safeValue(u.email),

        password: safeValue(
          u.password_text
        ),

        invPassword: safeValue(
          u.investor_password
        ),

        emailStatus:
          safeValue(
            u.email_status
          ) || "Not Verified",

        document:
          safeValue(
            u.document_status
          ) || "Not Verified",

        status:
          safeValue(u.status) ||
          "Active",

        fund: safeValue(u.fund),

        balance: safeValue(
          u.balance
        ),

        date: safeValue(
          u.created_at
        ),

        challenge:
          safeValue(
            u.challenge_name
          ) || "-",

        challengeAcc:
          safeValue(
            u.challenge_account
          ) || "-",
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) =>
      Object.values(u)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="w-full max-w-full">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">

          <h2 className="text-lg sm:text-xl font-semibold">
            Manage User
          </h2>

          <div className="flex gap-2 flex-wrap">

            {/* <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              Create User
            </button>

            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              Add User
            </button> */}

          </div>

        </div>

        <div className="flex justify-between items-center px-4 sm:px-6 py-4">

          <div className="flex gap-2 flex-wrap">

            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              CSV
            </button>

            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              PDF
            </button>

            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              Excel
            </button>

          </div>

          <div className="flex items-center gap-2">

            <span className="text-sm">
              Search:
            </span>

            <input
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Search..."
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="px-4 sm:px-6 pb-6">

          <div className="rounded-xl border overflow-hidden">

            <div className="w-full overflow-x-auto">

              <table className="min-w-[1800px] w-full text-sm border-separate border-spacing-0">

                <thead className="bg-[#353b8f] text-white">

                  <tr>

                    <th className="px-3 py-3">
                      S.No
                    </th>

                    <th>Name</th>

                    <th>
                      Deposit <br />
                      Withdraw
                    </th>

                    <th>AC ID</th>

                    <th>Email</th>

                    {/* <th>Password</th>

                    <th>
                      Inv Password
                    </th> */}

                    <th>E-Mail</th>

                    <th>Document</th>

                    <th>Status</th>

                    {/* <th>Fund</th> */}

                    <th>Balance</th>

                    <th>Date</th>

                    {/* <th>Challenge</th>

                    <th>
                      Challenge
                      Account
                    </th> */}

                    <th>
                      Edit <br />
                      Password
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={16}
                        className="py-10 text-center"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : filtered.length >
                    0 ? (

                    filtered.map(
                      (u, i) => (
                        <tr
                          key={u.id}
                          className="border-b hover:bg-gray-50 text-center"
                        >

                          <td className="py-2">
                            {i + 1}
                          </td>

                          <td>
                            {safeValue(
                              u.name
                            )}
                          </td>

                          <td className="flex justify-center gap-1 items-center mt-1.5">

                            <Edit
                              size={12}
                            />

                            <br />

                            <Trash
                              size={12}
                            />

                          </td>

                          <td>
                            {safeValue(
                              u.accId
                            )}
                          </td>

                          <td>
                            {safeValue(
                              u.email
                            )}
                          </td>

                          {/* <td>
                            {safeValue(
                              u.password
                            )}
                          </td>

                          <td>
                            {safeValue(
                              u.invPassword
                            )}
                          </td> */}

                          <td>

                            <span
                              className={`px-2 py-1 rounded ${badge(
                                u.emailStatus
                              )}`}
                            >
                              {
                                u.emailStatus
                              }
                            </span>

                          </td>

                          <td>

                            <span
                              className={`px-2 py-1 rounded ${badge(
                                u.document
                              )}`}
                            >
                              {u.document}
                            </span>

                          </td>

                          <td>

                            <span
                              className={`px-2 py-1 rounded ${badge(
                                u.status
                              )}`}
                            >
                              {u.status}
                            </span>

                          </td>

                          {/* <td>
                            {safeValue(
                              u.fund
                            )}
                          </td> */}

                          <td>
                            {safeValue(
                              u.balance
                            )}
                          </td>

                          <td>
                            {safeValue(
                              u.date
                            )}
                          </td>

                          {/* <td>
                            {safeValue(
                              u.challenge
                            )}
                          </td>

                          <td>
                            {safeValue(
                              u.challengeAcc
                            )}
                          </td> */}

                          <td className="flex justify-center">

                            <Edit
                              size={12}
                            />

                          </td>

                        </tr>
                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan={16}
                        className="py-10 text-center"
                      >
                        No users found
                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">

            <p>
              Showing {
                filtered.length
              }{" "}
              entries
            </p>

            <div className="flex gap-2">

              <button className="px-3 py-1 border rounded">
                Previous
              </button>

              <button className="px-3 py-1 bg-[#353b8f] text-white rounded">
                1
              </button>

              <button className="px-3 py-1 border rounded">
                Next
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FundedUser;