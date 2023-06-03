import React, { useState, createContext } from 'react'

export const UserContext = createContext();

function AuthContext({ children }) {
   

  return (
    <UserContext.Provider value={{ isAdminAuthenticated, isSellerAuthenticated, isCustomerAuthenticated,
        SellerLogin, CustomerLogin, AdminLogin, SellerLogout, CustomerLogout, AdminLogout
      }}>
    {/* {children} */}
  </UserContext.Provider>
  )
}

export default AuthContext