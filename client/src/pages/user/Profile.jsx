import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState(auth?.user?.address?.street || "");
  const [city, setCity] = useState(auth?.user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(auth?.user?.address?.postalCode || "");
  const [answer, setAnswer] = useState(""); // For security question
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { email, name, phone, address, answer } = auth?.user || {};
    setName(name || "");
    setEmail(email || "");
    setPhone(phone || "");
    setStreet(address?.street || "");
    setCity(address?.city || "");
    setPostalCode(address?.postalCode || "");
    setAnswer(answer || "");
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address: { street, city, postalCode },
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Your profile"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container ">
              <form onSubmit={handleSubmit}>
                <h4 className="title"> USER PROFILE</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    className="form-control"
                    placeholder="Enter Your Email "
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Password (leave blank to keep current)"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Phone"
                  />
                </div>

                <h6 className="mt-3">Address</h6>
                <div className="mb-3">
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="form-control"
                    placeholder="Street Address"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-control"
                    placeholder="City"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="form-control"
                    placeholder="Postal Code"
                  />
                </div>

                <h6 className="mt-3">Security</h6>
                <div className="mb-3">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Security Question Answer"
                    readOnly // Assuming you don't want users to change this here
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "UPDATE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;