import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentPrescriptions = [
  {
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    prescription: "Amoxicillin 500mg",
  },
  {
    name: "Emma Williams",
    email: "emma.williams@example.com",
    prescription: "Lisinopril 10mg",
  },
  {
    name: "Liam Brown",
    email: "liam.brown@example.com",
    prescription: "Metformin 1000mg",
  },
  {
    name: "Noah Jones",
    email: "noah.jones@example.com",
    prescription: "Atorvastatin 40mg",
  },
  {
    name: "Ava Davis",
    email: "ava.davis@example.com",
    prescription: "Levothyroxine 50mcg",
  },
]

export function RecentPrescriptions() {
  return (
    <div className="space-y-8">
      {recentPrescriptions.map((prescription) => (
        <div key={prescription.email} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${prescription.name}.png`} alt={prescription.name} />
            <AvatarFallback>
              {prescription.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{prescription.name}</p>
            <p className="text-sm text-muted-foreground">{prescription.prescription}</p>
          </div>
          <div className="ml-auto font-medium">Today</div>
        </div>
      ))}
    </div>
  )
}

