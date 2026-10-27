import React from 'react'
import { motion } from 'motion/react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero/>
      <FeaturedSection/>
      <Banner/>
      <Testimonial/>
      <NewsLetter/>
    </motion.div>
  )
}

export default Home
