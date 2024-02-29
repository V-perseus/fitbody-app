interface TableRow {
  set: string
  reps: string
  weight: string
}

export interface TableProps {
  data: TableRow[]
  bgColor?: string
}
