import { Card } from '@mui/material'

export const Dashboard = () => {
  return (
    <section className="flex grid-cols gap-2">
      <Card className="w-1/5 h-1/4 p-2">div 1</Card>
      <Card className="w-1/5 h-1/4 p-2">Card 6</Card>
      <Card className="w-1/5 h-1/4 p-2">Card 5</Card>
      <Card className="w-1/5 h-1/4 p-2">Card 4</Card>
      <Card className="w-1/5 h-1/4 p-2">Card 3</Card>
      <Card className="w-1/5 h-1/4 p-2">Card 2</Card>
    </section>
  )
}
