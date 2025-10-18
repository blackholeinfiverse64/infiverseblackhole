import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Enhanced Tabs Root with proper state management
const Tabs = React.forwardRef(({ className, onValueChange, ...props }, ref) => {
  const timeoutRef = React.useRef(null)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const handleValueChange = React.useCallback((value) => {
    // Prevent rapid switching
    if (isTransitioning) return
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsTransitioning(true)

    // Call the original onValueChange
    if (onValueChange) {
      onValueChange(value)
    }

    // Reset transitioning state after animation completes
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Match this with CSS transition duration
  }, [onValueChange, isTransitioning])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn(className)}
      onValueChange={handleValueChange}
      {...props}
    />
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const contentRef = React.useRef(null)

  React.useEffect(() => {
    // Trigger animation when content becomes visible
    const observer = new MutationObserver(() => {
      if (contentRef.current) {
        const state = contentRef.current.getAttribute('data-state')
        // Force reflow for smooth transition
        if (state === 'active') {
          void contentRef.current.offsetHeight
        }
      }
    })

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        attributes: true,
        attributeFilter: ['data-state']
      })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <TabsPrimitive.Content
      ref={(node) => {
        contentRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none",
        "data-[state=active]:opacity-100 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
        "transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
