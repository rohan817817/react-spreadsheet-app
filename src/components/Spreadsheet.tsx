import React, { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'

type RowData = Record<string, string>

interface SpreadsheetProps {
  data: RowData[]
  onUpdate: (data: RowData[]) => void
}

export default function Spreadsheet({ data, onUpdate }: SpreadsheetProps) {
  const [tableData, setTableData] = useState<RowData[]>(data)
  const [columnKeys, setColumnKeys] = useState<string[]>([])
  const [columnNames, setColumnNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (data.length > 0) {
      const keys = Object.keys(data[0])
      setColumnKeys(keys)
      const nameMap: Record<string, string> = {}
      keys.forEach((key, i) => {
        nameMap[key] = `Column ${i + 1}`
      })
      setColumnNames(nameMap)
    }
  }, [data])

  const handleHeaderRename = (key: string, newName: string) => {
    setColumnNames((prev) => ({ ...prev, [key]: newName }))
  }

  const columns: ColumnDef<RowData>[] = columnKeys.map((key) => {
    return {
      accessorKey: key,
      enableResizing: true,
      header: function HeaderComponent() {
        const [editing, setEditing] = useState(false)
        const [temp, setTemp] = useState(columnNames[key] ?? key)

        return editing ? (
          <div className="w-full">
            <label htmlFor={`header-${key}`} className="sr-only">
              Rename Column
            </label>
            <input
              id={`header-${key}`}
              className="border px-1 rounded text-sm w-full"
              value={temp}
              autoFocus
              onChange={(e) => setTemp(e.target.value)}
              onBlur={() => {
                handleHeaderRename(key, temp)
                setEditing(false)
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className="cursor-pointer text-gray-800"
              onDoubleClick={() => setEditing(true)}
            >
              {columnNames[key] || key}
            </span>
            <button
              onClick={() => handleDeleteColumn(key)}
              className="ml-1 text-red-500 hover:text-red-700 text-xs"
              aria-label={`Delete ${columnNames[key] || key}`}
            >
              ✕
            </button>
          </div>
        )
      },
      cell: (info) => (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newValue = e.currentTarget.textContent || ''
            const newData = [...tableData]
            newData[info.row.index][key] = newValue
            setTableData(newData)
            onUpdate(newData)
          }}
        >
          {info.getValue() as string}
        </div>
      ),
    }
  })

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  })

  const handleAddRow = () => {
    const newRow: RowData = {}
    columnKeys.forEach((col) => {
      newRow[col] = ''
    })
    const updated = [...tableData, newRow]
    setTableData(updated)
    onUpdate(updated)
  }

  const handleAddColumn = () => {
    const newKey = `Column ${columnKeys.length + 1}`
    const newData = tableData.map((row) => ({ ...row, [newKey]: '' }))
    const newColumns = [...columnKeys, newKey]
    const updatedNames = { ...columnNames, [newKey]: newKey }

    setTableData(newData)
    setColumnKeys(newColumns)
    setColumnNames(updatedNames)
    onUpdate(newData)
  }

  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...tableData]
    newData.splice(rowIndex, 1)
    setTableData(newData)
    onUpdate(newData)
  }

  const handleDeleteColumn = (key: string) => {
    const newColumns = columnKeys.filter((col) => col !== key)
    const newData = tableData.map((row) => {
    const rest = { ...row };
    delete rest[key];
    return rest;
  });
    const newNames = { ...columnNames }
    delete newNames[key]
    setColumnKeys(newColumns)
    setColumnNames(newNames)
    setTableData(newData)
    onUpdate(newData)
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleAddRow}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          + Add Row
        </button>
        <button
          onClick={handleAddColumn}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          + Add Column
        </button>
      </div>

      <div className="overflow-auto w-full">
        <table className="w-full text-xs border-collapse table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="sticky left-0 bg-white z-20 shadow-sm px-2 py-1 border border-gray-200 text-gray-600 text-center"
                style={{ width: '60px', minWidth: '60px', maxWidth: '60px' }}
              >
                #
              </th>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="relative px-2 py-1 border border-gray-200 text-gray-700 font-medium group"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize group-hover:bg-gray-400"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id}>
                <td
                  className="sticky left-0 bg-white z-10 shadow-sm px-2 py-1 border border-gray-200 text-gray-500 text-center"
                  style={{ width: '60px', minWidth: '60px', maxWidth: '60px' }}
                >
                  <div className="flex items-center justify-between">
                    <span>{rowIndex + 1}</span>
                    <button
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="ml-1 text-red-500 hover:text-red-700 text-xs"
                      aria-label={`Delete row ${rowIndex + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-1 border border-gray-200"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
