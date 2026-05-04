import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useOnClickOutside } from 'usehooks-ts'

import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'

interface Tab {
  title: string
  icon?: LucideIcon
  to?: string
  badge?: boolean
  imageUrl?: string
  type?: never
}

interface Separator {
  type: 'separator'
  title?: never
  icon?: never
}

type TabItem = Tab | Separator

interface ExpandedTabsProps {
  tabs: TabItem[]
  className?: string
  activeColor?: string
  selectedIndex?: number | null
  defaultSelectedIndex?: number | null
  onChange?: (index: number | null) => void
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? '.5rem' : 0,
    paddingLeft: isSelected ? '1rem' : '.5rem',
    paddingRight: isSelected ? '1rem' : '.5rem',
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.1, duration: 0.2 }

export function ExpandedTabs({
  tabs,
  className,
  activeColor = 'text-white',
  selectedIndex,
  defaultSelectedIndex = null,
  onChange,
}: ExpandedTabsProps) {
  const isControlled = selectedIndex !== undefined
  const [uncontrolledSelected, setUncontrolledSelected] = useState<
    number | null
  >(defaultSelectedIndex)
  const selected = isControlled ? selectedIndex! : uncontrolledSelected

  const outsideClickRef = useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement,
  )

  useOnClickOutside(outsideClickRef, () => {
    if (!isControlled) setUncontrolledSelected(null)
    onChange?.(null)
  })

  const handleSelect = (index: number) => {
    if (!isControlled) setUncontrolledSelected(index)
    onChange?.(index)
  }

  const Separator = () => (
    <div className=' h-[24px] w-[1.2px] bg-border' aria-hidden='true' />
  )

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        ' flex gap-2 rounded-2xl border border-border bg-background p-2 shadow-sm ',
        className,
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === 'separator') {
          return <Separator key={`separator-${index}`} />
        }

        const Icon = tab.icon
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate='animate'
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              'relative flex items-center rounded-4xl px-3 py-2 text-sm font-medium transition-colors duration-300',
              selected === index
                ? cn('bg-primary shadow-2xl shadow-primary/80', activeColor)
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {tab.imageUrl ? (
              <img
                src={tab.imageUrl}
                alt={tab.title}
                className='h-10 w-10 rounded-full object-cover'
              />
            ) : Icon ? (
              <Icon size={25} />
            ) : null}
            {tab.badge && (
              <span className='absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-white'>
                2
              </span>
            )}
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={transition}
                  className='overflow-hidden'
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}

export default ExpandedTabs
