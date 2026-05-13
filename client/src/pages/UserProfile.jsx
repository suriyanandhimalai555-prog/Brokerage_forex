import React, {
  useEffect,
  useState,
} from "react";

const UserProfile = () => {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      phone_number: "",
      address: "",
    });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const fetchProfile = async () => {
    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
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

      const user = data?.user || {};

      const profileData = {
        name: user.name || "",
        email: user.email || "",
        phone_number:
          user.phone_number || "",
        address:
          user.address || "",
      };

      setProfile(profileData);

      setForm(profileData);

      if (
  !user.phone_number ||
  !user.address
) {
  setOpenEdit(true);
}

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {

      if (
        !form.name ||
        !form.email ||
        !form.phone_number ||
        !form.address
      ) {
        alert(
          "Please fill all fields"
        );

        return;
      }

      setSaving(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone_number:
              form.phone_number,
            address:
              form.address,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(
          data.message ||
            "Failed to update profile"
        );

        return;
      }

      setProfile(form);

      setOpenEdit(false);

      alert("Profile updated");

    } catch (err) {

      console.error(err);

    } finally {

      setSaving(false);

    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex items-center justify-between border-b pb-4">

        <h1 className="text-3xl font-semibold">
          Profile
        </h1>

        {!loading && (

          <button
            onClick={() =>
              setOpenEdit(true)
            }
            className="h-11 px-5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium transition"
          >
            Edit Profile
          </button>

        )}

      </div>

      {loading ? (

        <div className="py-16 text-center text-gray-500">
          Loading...
        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="border rounded-2xl p-5">

            <p className="text-sm text-gray-500 mb-2">
              Full Name
            </p>

            <h2 className="text-lg font-semibold text-gray-800 break-all">
              {profile.name || "-"}
            </h2>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-sm text-gray-500 mb-2">
              Email Address
            </p>

            <h2 className="text-lg font-semibold text-gray-800 break-all">
              {profile.email || "-"}
            </h2>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-sm text-gray-500 mb-2">
              Phone Number
            </p>

            <h2 className="text-lg font-semibold text-gray-800 break-all">
              {profile.phone_number ||
                "-"}
            </h2>

          </div>

          <div className="border rounded-2xl p-5">

            <p className="text-sm text-gray-500 mb-2">
              Address
            </p>

            <h2 className="text-lg font-semibold text-gray-800 break-words">
              {profile.address || "-"}
            </h2>

          </div>

        </div>
      )}

      {openEdit && (

        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between border-b px-6 py-4">

              <h2 className="text-xl font-semibold">
                Update Profile
              </h2>

              <button
                onClick={() => {

                  if (
                    profile.phone_number &&
                    profile.address
                  ) {
                    setOpenEdit(
                      false
                    );
                  }

                }}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>

            </div>

            <div className="p-6 space-y-5">

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
                  className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter full name"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                  className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter email"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={
                    form.phone_number
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone_number:
                        e.target.value,
                    })
                  }
                  className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter phone number"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>

                <textarea
                  rows={4}
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter address"
                />

              </div>

            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">

              {profile.phone_number &&
                profile.address && (

                  <button
                    onClick={() =>
                      setOpenEdit(
                        false
                      )
                    }
                    className="h-11 px-5 border rounded-xl font-medium"
                  >
                    Cancel
                  </button>

                )}

              <button
                onClick={saveProfile}
                disabled={saving}
                className="h-11 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium transition"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default UserProfile;