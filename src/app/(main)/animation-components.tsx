/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export default function LoretoTradingH1() {
  return (
    <motion.h1
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      Loreto <span className='text-rose-600'>Trading</span>
    </motion.h1>
  )
}

export function LoretoTradingAbout() {
  return (
    <motion.p
      className='text-muted-foreground mt-4 max-w-[490px] text-justify'
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay: 0.5 }}
    >
      We are a company that specializes in providing{' '}
      <strong>packaging solutions</strong>. Our unique feature allows for the
      resizing of boxes and the addition of layout markings. With our services,
      you can customize boxes to perfectly fit your specific size requirements,
      complete with accurate markings for easy assembly and organization.
    </motion.p>
  )
}

export function LoretoTradingImage() {
  return (
    <motion.img
      src='/order_delivered.svg'
      alt='box'
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -100 }}
      transition={{ delay: 1 }}
    />
  )
}
