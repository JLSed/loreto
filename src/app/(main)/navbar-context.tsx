'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the shape of the context
interface NavbarContextType {
  isOpen: boolean
  toggleNavbar: () => void
  openNavbar: () => void
  closeNavbar: () => void
}

// Create the context
const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

// Create a provider component
export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNavbar = () => setIsOpen((prev) => !prev)
  const openNavbar = () => setIsOpen(true)
  const closeNavbar = () => setIsOpen(false)

  return (
    <NavbarContext.Provider
      value={{ isOpen, toggleNavbar, openNavbar, closeNavbar }}
    >
      {children}
    </NavbarContext.Provider>
  )
}

// Custom hook for easier access
export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
