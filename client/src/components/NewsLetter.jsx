
import React from 'react'
import { motion } from 'motion/react'

const Newsletter = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40"
        >
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:text-4xl text-2xl font-semibold"
            >
                Never Miss a Deal!
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:text-lg text-gray-500/70 pb-8"
            >
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </motion.p>

            <motion.form
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12 shadow-sm"
            >
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-4 text-gray-600 focus:border-primary transition-colors"
                    type="email"
                    placeholder="Enter your email id"
                    required
                />

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none font-medium text-sm md:text-base shrink-0"
                >
                    Subscribe
                </motion.button>
            </motion.form>
        </motion.div>
    )
}

export default Newsletter
