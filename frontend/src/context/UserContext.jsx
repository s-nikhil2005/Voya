import  { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

// Create User Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user data from sessionStorage on initial render
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  // Save user to sessionStorage whenever it changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Function to update user
  const updateUser = (newUser) => {
    setUser((prev) => ({ ...prev, ...newUser }));
  };
  const deleteUser = () => {
  sessionStorage.removeItem("user");
  setUser({});
};

  const resetUser = () => {
    setUser(null);
  };
  return (
    <UserContext.Provider value={{ user, updateUser, deleteUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => useContext(UserContext);
