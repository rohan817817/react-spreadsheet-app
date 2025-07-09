import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SheetRow = Record<string, string>

type Tab = {
  id: number
  name: string
  data: SheetRow[]
}

interface TabBarProps {
  onTabSwitch: (data: SheetRow[]) => void
}

export default function TabBar({ onTabSwitch }: TabBarProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, name: 'Sheet 1', data: [] },
  ])
  const [activeId, setActiveId] = useState<number>(1)
  const [editingId, setEditingId] = useState<number | null>(null)

  const addTab = () => {
    const newId = Date.now()
    const newTab: Tab = {
      id: newId,
      name: `Sheet ${tabs.length + 1}`,
      data: [],
    }
    setTabs([...tabs, newTab])
    setActiveId(newId)
    onTabSwitch(newTab.data)
  }

  const renameTab = (id: number, newName: string) => {
    setTabs(tabs.map((t) => (t.id === id ? { ...t, name: newName } : t)))
    setEditingId(null)
  }

  const closeTab = (id: number) => {
    const filtered = tabs.filter((t) => t.id !== id)
    setTabs(filtered)

    if (activeId === id && filtered.length > 0) {
      setActiveId(filtered[0].id)
      onTabSwitch(filtered[0].data)
    }
  }

  const handleClickTab = (tab: Tab) => {
    setActiveId(tab.id)
    onTabSwitch(tab.data)
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200 text-sm font-medium">
      <AnimatePresence>
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-t-md cursor-pointer transition-colors ${
                activeId === tab.id
                  ? 'bg-white border-x border-t border-gray-300 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {editingId === tab.id ? (
                <>
                  <label htmlFor={`tab-${tab.id}`} className="sr-only">
                    Rename tab
                  </label>
                  <input
                    id={`tab-${tab.id}`}
                    type="text"
                    className="bg-transparent outline-none border-b border-blue-500"
                    value={tab.name}
                    onChange={(e) => renameTab(tab.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                </>
              ) : (
                <span
                  onDoubleClick={() => setEditingId(tab.id)}
                  onClick={() => handleClickTab(tab)}
                >
                  {tab.name}
                </span>
              )}
              {tabs.length > 1 && (
                <button
                  onClick={() => closeTab(tab.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label={`Close ${tab.name}`}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={addTab}
        className="ml-2 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500"
      >
        + Add Sheet
      </button>
    </div>
  )
}
