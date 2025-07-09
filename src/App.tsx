import React, { useState, useRef, useEffect } from 'react'
import Spreadsheet from './components/Spreadsheet'

type SheetRow = Record<string, string> 

const initialSheet: SheetRow[] = [{ A: '', B: '', C: '' }]

function App() {
  const [sheets, setSheets] = useState<SheetRow[][]>([initialSheet])
  const [activeSheet, setActiveSheet] = useState<number>(0)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleNewSheet = () => {
    setSheets([...sheets, initialSheet])
    setActiveSheet(sheets.length)
  }

  const handleDeleteSheet = () => {
    if (sheets.length > 1) {
      const newSheets = sheets.filter((_, index) => index !== activeSheet)
      setSheets(newSheets)
      setActiveSheet(Math.max(0, activeSheet - 1))
    }
  }

  const handleUpdate = (newData: SheetRow[]) => {
    const updatedSheets = [...sheets]
    updatedSheets[activeSheet] = newData
    setSheets(updatedSheets)
  }

  const handleExport = () => {
    const sheetData = sheets[activeSheet]
    const blob = new Blob([JSON.stringify(sheetData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sheet-${activeSheet + 1}.json`
    link.click()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="p-4 max-w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-wrap gap-2">
          {sheets.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              className={`px-3 py-1 border rounded ${
                activeSheet === index ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Sheet {index + 1}
            </button>
          ))}
          <button
            onClick={handleNewSheet}
            className="px-3 py-1 border rounded bg-green-100 hover:bg-green-200"
          >
            + New Sheet
          </button>
          {sheets.length > 1 && (
            <button
              onClick={handleDeleteSheet}
              className="px-3 py-1 border rounded text-red-500 hover:bg-red-50"
            >
              🗑 Delete Sheet
            </button>
          )}
          <button
            onClick={() => console.log('Share clicked')}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            📤 Share
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            💾 Export
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="https://cdn.pixabay.com/photo/2013/07/13/12/46/user-160319_1280.png"
              alt="Profile"
              className="w-8 h-8 rounded-full border cursor-pointer"
            />
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border rounded z-50">
              <div
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  console.log('Settings clicked')
                  setDropdownOpen(false)
                }}
              >
                Settings
              </div>
              <div
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  console.log('Logout clicked')
                  setDropdownOpen(false)
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        <strong>React Spreadsheet App</strong>
      </div>

      <div className="mt-4">
        <Spreadsheet data={sheets[activeSheet]} onUpdate={handleUpdate} />
      </div>
    </div>
  )
}

export default App
