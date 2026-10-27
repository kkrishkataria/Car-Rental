import React from 'react'
import { motion } from 'motion/react'

const Title = ({ title, subTitle, align }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`flex flex-col justify-center items-center text-center ${
                align === "left" && "md:items-start md:text-left"
            }`}
        >
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className='font-semibold text-4xl md:text-[40px]'
            >
                {title}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='text-sm md:text-base text-gray-500/90 mt-2 max-w-156'
            >
                {subTitle}
            </motion.p>
        </motion.div>
    )
}

export default Title