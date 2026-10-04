import { m } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StaggerGroup({ children, className = '', as = 'div', viewport = true }) {
  const Component = m[as] || m.div
  const props = viewport
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.12 } }
    : { initial: 'hidden', animate: 'visible' }

  return (
    <Component className={className} variants={containerVariants} {...props}>
      {children}
    </Component>
  )
}

export function StaggerItem({ children, className = '', as = 'div' }) {
  const Component = m[as] || m.div
  return <Component className={className} variants={itemVariants}>{children}</Component>
}
