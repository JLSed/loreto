'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NavbarContextType {
  isOpen: boolean
  toggleNavbar: () => void
  openNavbar: () => void
  closeNavbar: () => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

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

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
